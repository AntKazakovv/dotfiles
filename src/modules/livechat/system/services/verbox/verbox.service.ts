import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {
    UIRouter,
    UIRouterGlobals,
} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';
import _isNull from 'lodash-es/isNull';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ILivechatVerboxConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {LivechatAbstract} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class VerboxService extends LivechatAbstract<ILivechatVerboxConfig> {
    public override chatId = 'verbox';
    public override forceHideStyles = '#supportTrigger {display: none !important;}';
    public canChatDestroy = true;
    private currentEmail: string = null;

    constructor(
        @Inject(DOCUMENT) document: Document,
        @Inject(WINDOW) protected window: Window,
        eventService: EventService,
        configService: ConfigService,
        protected logService: LogService,
        protected translateService: TranslateService,
        router: UIRouter,
        protected routerGlobals: UIRouterGlobals,
    ) {
        super(document, eventService, router, configService);
    }

    /**
     * Main init verbox chat code method
     */
    public override init(): void {
        super.init();

        let current = this.translateService.currentLang;
        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (lang !== current) {
                this.rerunWidget();
                current = lang;
            }
        });

        if (this.chatIsLoaded() && this.options.autocomplete) {
            this.setUserSettings();
        }
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        try {
            this.window.Verbox('openSupport');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        try {
            this.window.Verbox('closeSupport');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * destroy chat widget
     */
    public destroyWidget(): void {
        if (this.window.Verbox) {
            this.window.Verbox('destroy');
            const sc = this.document.getElementById('supportScript');
            sc?.parentNode?.removeChild(sc);
        }
    }

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public rerunWidget(): void {
        this.destroyWidget();
        this.initChat();
    }

    /**
     * Check chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return !!this.window.Verbox;
    }

    protected override initChat(isErrorSrc?: boolean): void {

        if (this.options.type !== 'verbox' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && this.window.WLC_ENV) {
            return;
        }

        if (this.isExcludeStates) {
            return;
        }
        const script = this.document.createElement('script');
        script.type ='text/javascript';
        script.id = 'supportScript';
        script.async = true;

        script.src = (isErrorSrc ? 'https://static.site-chat.me/support/support.int.js'
            : 'https://admin.verbox.ru/support/support.js') + '?h=' + this.options.code;

        script.onerror = () => {
            if (!isErrorSrc) {
                this.document.getElementById('supportScript').remove();
                this.initChat(true);
            }
        };

        this.window.VerboxSetup = this.options?.verboxSetup || {};
        this.window.VerboxSetup.language  = this.translateService.currentLang || 'en';
        this.window.supportAPIMethod = 'Verbox';

        if (!this.chatIsLoaded()) {
            this.window['Verbox'] = function () {
                (this.window['Verbox'].q = this.window['Verbox'].q || []).push(arguments);
            };
        }
        this.document.documentElement.firstChild.appendChild(script);
    }

    protected setUserSettings(): void {
        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(
                filter((v) => !!v && (this.currentEmail !== v.email)),
            )
            .subscribe((userProfile) => {
                if (userProfile.email) {
                    this.window.Verbox('setClientInfo', {
                        email: userProfile.email,
                    });
                } else {
                    localStorage.clear();
                }

                if (!this.options.showOnlyAuth && !_isNull(this.currentEmail)) {
                    this.rerunWidget();
                }

                this.currentEmail = userProfile.email;
            });
    }
}
