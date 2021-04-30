import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {LivechatAbstract} from '../../classes/livechatAbstract.class';
import {
    ConfigService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
import {ILivechatConfig} from '../../interfaces/livechat.interface';

import _get from 'lodash-es/get';

@Injectable({
    providedIn: 'root',
})
export class ChatraService extends LivechatAbstract {
    public chatId = 'chatra';
    protected options: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');

    constructor(
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
        protected translateService: TranslateService,
    ) {
        super(document, eventService);
    }

    /**
     * Main init chatra chat code method
     */
    public init(): void {
        this.initChat();
        if (this.options?.group) {
            this.translateService.onLangChange.subscribe(() => {
                this.reloadChat();
            });
        }
    }

    /**
     * Check chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return !!window.Chatra;
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        if (this.chatIsLoaded()) {
            window.Chatra('openChat', true);
        } else {
            this.logService.sendLog({code: '14.0.0'});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        if (this.chatIsLoaded()) {
            window.Chatra('minimizeWidget');
            window.Chatra('hide');
        } else {
            this.logService.sendLog({code: '14.0.0'});
        }
    }

    /**
     * Reload chat (re-init)
     */
    public reloadChat(): void {
        this.initChat();
    }

    protected initChat(): void {
        if (this.options.type !== 'chatra' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && window.WLC_ENV) {
            return;
        }

        const locale = this.translateService.currentLang || 'en';
        this.changeLocale(locale);

        if (this.options.hidden) {
            this.hiddenChatStart();
        }

        window.ChatraSetup = this.options?.chatraSetup || {};
        window.ChatraID = this.options.code;

        const s = this.document.createElement('script');
        // tslint:disable-next-line: only-arrow-functions space-before-function-paren
        window['Chatra'] = function () {
            (window['Chatra'].q = window['Chatra'].q || []).push(arguments);
        };
        s.async = true;
        s.src = 'https://call.chatra.io/chatra.js';

        this.document.head.appendChild(s);
    }

    protected changeLocale(locale: string): void {
        const locales = this.options.group;
        if (locales) {
            window.ChatraGroupID = _get(locales, locale) || locales.en;
        }
    }

    protected hiddenChatStart(): void {
        window.ChatraSetup = {
            startHidden: true,
        };
    }
}
