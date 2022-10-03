import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter} from '@uirouter/core';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ILivechatChatraConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {LivechatAbstract} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

import _get from 'lodash-es/get';

@Injectable({
    providedIn: 'root',
})
export class ChatraService extends LivechatAbstract<ILivechatChatraConfig> {
    public chatId = 'chatra';
    public forceHideStyles = '#chatra:not(.chatra--expanded) {display: none !important;}';
    public canChatDestroy: true;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
        protected translateService: TranslateService,
        protected router: UIRouter,
    ) {
        super(document, eventService, router, configService);
    }

    /**
     * Main init chatra chat code method
     */
    public init(): void {
        super.init();

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
        return !!this.window.Chatra;
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        try {
            this.window.Chatra('openChat', true);
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        try {
            this.window.Chatra('minimizeWidget');
            this.window.Chatra('hide');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Reload chat (re-init)
     */
    public reloadChat(): void {
        this.initChat();
    }

    /**
     * destroy chat widget
     */
    public destroyWidget(): void {
        if (this.window.Chatra) {
            this.window.Chatra('kill');
        }
    }

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public rerunWidget():void {
        this.window.Chatra('restart');
    }

    protected initChat(): void {
        if (this.options.type !== 'chatra' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && this.window.WLC_ENV) {
            return;
        }

        const locale = this.translateService.currentLang || 'en';
        this.changeLocale(locale);

        if (this.options.hidden) {
            this.hiddenChatStart();
        }

        this.window.ChatraSetup = this.options?.chatraSetup || {};
        this.window.ChatraID = this.options.code;

        const s = this.document.createElement('script');
        // tslint:disable-next-line: only-arrow-functions space-before-function-paren
        this.window['Chatra'] = function () {
            (this.window['Chatra'].q = this.window['Chatra'].q || []).push(arguments);
        };
        s.async = true;
        s.src = 'https://call.chatra.io/chatra.js';

        this.document.head.appendChild(s);
    }

    protected changeLocale(locale: string): void {
        const locales = this.options.group;
        if (locales) {
            this.window.ChatraGroupID = _get(locales, locale) || locales.en;
        }
    }

    protected hiddenChatStart(): void {
        this.window.ChatraSetup = {
            startHidden: true,
        };
    }
}
