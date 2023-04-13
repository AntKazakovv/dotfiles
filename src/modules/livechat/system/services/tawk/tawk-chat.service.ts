import {
    Injectable,
    Inject,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {DOCUMENT} from '@angular/common';

import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';import _get from 'lodash-es/get';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {
    ILivechatTawkConfig,
    ILiveChatTawkLangGroup,
} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {
    LivechatAbstract,
    ChatState,
} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class TawkChatService extends LivechatAbstract<ILivechatTawkConfig> {
    public chatIsLoad: boolean = false;
    public canChatDestroy = false;
    private locale: ILiveChatTawkLangGroup;
    constructor(
        @Inject(DOCUMENT) document: Document,
        @Inject(WINDOW) protected window: Window,
        eventService: EventService,
        configService: ConfigService,
        protected logService: LogService,
        router: UIRouter,
        protected translateService: TranslateService,
    ) {
        super(document, eventService, router, configService);
    }

    /**
     * Check chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return this.window.Tawk_API && this.chatIsLoad;
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        try {
            if (this.window.Tawk_API.isChatHidden()) {
                this.window.Tawk_API.showWidget();
            }
            this.window.Tawk_API.maximize();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        try {
            if (this.window.Tawk_API.isChatMaximized()) {
                this.window.Tawk_API.minimize();
            }
            this.window.Tawk_API.hideWidget();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Hides chat widget button
     */
    public override hideWidget(): void {
        try {
            this.window.Tawk_API.hideWidget();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public rerunWidget(): void {
        this.showWidget();
    }

    /**
     * Destroy chat widget
     */
    public destroyWidget(): void {
        this.window.Tawk_API.minimize();
        this.hideWidget();
    }

    /**
     * Shows hidden chats widget button
     */
    public override showWidget(): void {
        try {
            this.window.Tawk_API.showWidget();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Toggle chat window method
     */
    public override toggleChat(): void {
        if (!this.chatIsLoaded()) {
            return;
        }
        if (this.window.Tawk_API.isChatHidden()) {
            this.window.Tawk_API.showWidget();
        } else {
            this.window.Tawk_API.hideWidget();
        }
        if (this.window.Tawk_API.isChatMaximized()) {
            this.window.Tawk_API.minimize();
        } else {
            this.window.Tawk_API.maximize();
        }
    }

    /**
    * Reload chat (re-init)
    */
    public reloadChat(): void {
        this.initChat();
    }

    protected override initChat(): void {

        if (this.options?.group) {
            const changeLang = this.translateService.onLangChange.subscribe(() => {
                this.document.head.querySelectorAll('script[src*="tawk"]').forEach((element) => {
                    element.remove();
                });
                this.document.body.querySelectorAll('script[src*="tawk"]').forEach((element) => {
                    element.remove();
                });

                changeLang.unsubscribe();

                for (const name in this.window) {
                    if (
                        this.window.hasOwnProperty(name) &&
                        (name.includes('tawk') || name.includes('Tawk'))
                    ) {
                        delete this.window[name];
                    }
                }
                this.document.body.querySelector('.widget-visible').remove();
                this.window.Tawk_API = {};
                this.initChat();
            });
        }

        this.chatState$ = new BehaviorSubject(null);

        if (this.options.type !== 'tawkChat' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && this.window.WLC_ENV) {
            return;
        }

        const lang: string = this.translateService.currentLang || 'en';
        this.locale = this.changeLocale(lang);

        if (this.isExcludeStates) {
            return;
        }

        this.window.Tawk_API = _get(this.window, 'Tawk_API', {});
        const s1 = this.document.createElement('script');

        s1.defer = true;
        s1.id = 'tawkScript';
        s1.type = 'application/javascript';
        s1.src = `https://embed.tawk.to/${this.locale.code}/${this.locale.subCode || 'default'}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        this.document.head.appendChild(s1);

        this.window.Tawk_API.onLoad = () => {
            this.chatState$.next(ChatState.loaded);
            this.chatIsLoad = true;

            if (this.options?.hidden) {
                this.hideWidget();
            }
        };

        this.window.Tawk_API.onChatMaximized = () => {
            this.chatState$.next(ChatState.opened);
        };

        this.window.Tawk_API.onChatMinimized = () => {
            this.chatState$.next(ChatState.minimized);
        };

        this.window.Tawk_API.onChatHidden = () => {
            this.chatState$.next(ChatState.hidden);
        };

        this.window.Tawk_API.onChatStarted = () => {
            this.chatState$.next(ChatState.started);
        };

        this.window.Tawk_API.onChatEnded = () => {
            this.chatState$.next(ChatState.ended);
        };
    }

    protected changeLocale(locale: string): ILiveChatTawkLangGroup {
        const defaultObjLocale: ILiveChatTawkLangGroup = {
            code: this.options.code,
            subCode: this.options.subCode,
        };
        const objLocale: ILiveChatTawkLangGroup = _get(this.options.group, locale, defaultObjLocale);
        return locale === 'en' ? defaultObjLocale : objLocale;
    }
}
