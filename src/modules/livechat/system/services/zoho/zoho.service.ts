import {
    Injectable,
    Inject,
} from '@angular/core';
import {Transition, UIRouter} from '@uirouter/core';
import {DOCUMENT} from '@angular/common';
import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';

import {first, skipWhile} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import _includes from 'lodash-es/includes';
import _reduce from 'lodash-es/reduce';

import {
    EventService,
    ConfigService,
    ActionService,
    LogService,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {ILivechatZohoConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {LivechatAbstract} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class ZohoChatService extends LivechatAbstract<ILivechatZohoConfig> {
    public override chatId = 'zsalesiq';
    public canChatDestroy = false;
    public chatLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected profile: UserProfile;
    protected lang: string;
    protected supportedLangs: string[] = [
        'ar',
        'bg',
        'da',
        'de',
        'cs',
        'el',
        'en',
        'es',
        'fa_IR',
        'fr',
        'ga',
        'hr',
        'hu',
        'hy',
        'it',
        'iw',
        'ja',
        'ka',
        'ko',
        'nb',
        'nl',
        'pl',
        'pt',
        'ro',
        'ru',
        'sk',
        'sl',
        'sv',
        'th',
        'tr',
        'zh',
    ];

    constructor(
        @Inject(DOCUMENT) document: Document,
        @Inject(WINDOW) protected window: Window,
        eventService: EventService,
        configService: ConfigService,
        actionService: ActionService,
        protected logService: LogService,
        protected translateService: TranslateService,
        router: UIRouter,
    ) {
        super(document, eventService, router, configService, actionService);
    }

    /**
     * Main init zoho chat code method
     */
    public override init(): void {
        super.init();
        this.lang = this.getLang(this.translateService.currentLang);
        this.rerunWidget();
        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            this.lang = this.getLang(lang);
            this.rerunWidget();
        });
    }

    /**
     * Check chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return this.chatLoaded$.getValue() && !!this.window.$zoho;
    }

    /**
     * destroy chat widget
     */
    public destroyWidget(): void {}

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public rerunWidget(): void {
        if (this.chatIsLoaded()) {
            this.window.$zoho.salesiq.ready = (): void => {
                this.window.$zoho.salesiq.language(this.lang);
                if (this.options.setUserDetails) {
                    this.setUserDetails();
                }
            };
            this.window.$zoho.salesiq.reset();
        }
    }

    /**
     * Open chat window method
     */
    public openChat(): void {}

    /**
     * Close chat window method
     */
    public hideChat(): void {}

    /**
     * Hides chat widget button
     */
    public override hideWidget(): void {
        this.window.$zoho?.salesiq.floatwindow.visible('hide');
        this.window.$zoho?.salesiq.floatbutton.visible('hide');
    };

    /**
     * Shows hidden chats widget button
     */
    public override showWidget(): void {
        this.window.$zoho?.salesiq.floatbutton.visible('show');
    };

    protected get fundistLink(): string {
        const prodLink = this.options.fundistProdLink || 'fundist.org';
        switch (this.window.WLC_ENV) {
            case 'dev' || 'qa':
                return 'https://qa.fundist.org/en/Users/Summary/';
            case 'test':
                return 'https://test.fundist.org/en/Users/Summary/';
            default:
                return `https://${prodLink}/en/Users/Summary/`;
        }
    }

    protected override initChat(): void {
        if (this.chatIsLoaded()) {
            return;
        }

        if (this.options.type !== 'zoho' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && this.window.WLC_ENV) {
            return;
        }

        if (this.isExcludeStates) {
            return;
        }

        this.window.$zoho ||= {};
        this.window.$zoho.salesiq ||= {
            widgetcode: this.options.code,
            values: {},
            ready: function(): void {},
        };
        const script = this.document.createElement('script');
        script.id = 'zsiqscript';
        script.type = 'text/javascript';
        script.defer = true;
        script.src = this.options.src;

        const sc = this.document.getElementsByTagName('script')[0];

        if (sc) {
            sc.parentNode.insertBefore(script, sc);
        } else {
            this.document.documentElement.firstChild.appendChild(script);
        }


        let counter: number = 0;
        const chatObserver = new MutationObserver(() => {
            if (this.document.querySelector(`[data-id="${this.chatId}"]`)) {
                this.chatLoaded$.next(true);
                chatObserver.disconnect();
            } else {
                counter++;
                if (counter > 10) {
                    chatObserver.disconnect();
                }
            }
        });

        chatObserver.observe(this.document.body, {
            childList: true,
            subtree: true,
        });

        script.onerror = (): void => {
            chatObserver.disconnect();
        };

        this.window.$zoho.salesiq.ready = (): void => {
            this.chatLoaded$.pipe(
                first((val: boolean) => val),
            ).subscribe(() => {
                if (this.options.setUserDetails) {
                    this.setHandlers();
                }
            });
        };
    }

    protected getLang(lang: string): string {
        lang = _reduce([
            ['pt', ['pt-br']],
            ['zh', ['zh-hans', 'zh-cn', 'zh-hant']],
        ], (lang, [newLang, findLang]): string => findLang.includes(lang) ? newLang as string : lang, lang);

        return this.supportedLangs.includes(lang) ? lang : 'en';
    }

    protected setHandlers(): void {
        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');
        userProfile$.pipe(skipWhile(v => !v))
            .subscribe((profile: UserProfile) => {
                this.profile = profile;
                if (this.chatIsLoaded()) {
                    this.rerunWidget();
                }
            });
    }

    protected setUserDetails(): void {
        if (this.profile?.idUser) {
            this.window.$zoho.salesiq.visitor.email(this.profile.email);
            this.window.$zoho.salesiq.visitor.name(`${this.profile.firstName} ${this.profile.lastName}`);
            this.window.$zoho.salesiq.visitor.info({
                'UserProfile': this.fundistLink + this.profile.idUser,
            });
        } else {
            this.window.$zoho.salesiq.visitor.info(null);
        }
    }

    /**
     * Check target transition state and close chat, if it's excludeStates in config
     */
    protected override subscribeTransitionStates(): void {
        this.router.transitionService.onSuccess({}, (transition: Transition) => {
            const stateName: string = transition.targetState().name();
            if (_includes(this.options.excludeStates, stateName)) {
                this.hideWidget();
            } else {
                this.chatIsLoaded() ? this.showWidget() : this.initChat();
            }
        });
    }
}
