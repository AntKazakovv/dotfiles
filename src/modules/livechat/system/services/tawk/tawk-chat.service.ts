import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
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
export class TawkChatService extends LivechatAbstract {
    public chatIsLoad: boolean = false;
    protected options: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');

    constructor(
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
    ) {
        super(document, eventService);
    }

    /**
     * Main init tawk chat code method
     */
    public init(): void {
        this.initChat();
    }

    /**
     * Check chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return window.Tawk_API && this.chatIsLoad;
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        if (this.chatIsLoaded()) {
            if (window.Tawk_API.isChatHidden()) {
                window.Tawk_API.showWidget();
            }
            window.Tawk_API.maximize();
        } else {
            this.logService.sendLog({code: '14.0.0'});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        if (this.chatIsLoaded()) {
            if (window.Tawk_API.isChatMaximized()) {
                window.Tawk_API.minimize();
            }
            window.Tawk_API.hideWidget();
        } else {
            this.logService.sendLog({code: '14.0.0'});
        }
    }

    /**
     * Toggle chat window method
     */
    public toggleChat(): void {
        if (!this.chatIsLoaded()) {
            return;
        }
        if (window.Tawk_API.isChatHidden()) {
            window.Tawk_API.showWidget();
        } else {
            window.Tawk_API.hideWidget();
        }
        if (window.Tawk_API.isChatMaximized()) {
            window.Tawk_API.minimize();
        } else {
            window.Tawk_API.maximize();
        }
    }

    protected initChat(): void {
        if (this.options.type !== 'tawkChat' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && window.WLC_ENV) {
            return;
        }

        window.Tawk_API = _get(window, 'Tawk_API', {});
        const Tawk_LoadStart = new Date();
        const s1 = this.document.createElement('script'),
            s0 = this.document.getElementsByTagName('script')[0];

        s1.async = true;
        s1.type = 'text/javascript';
        s1.src = `https://embed.tawk.to/${this.options.code}/${this.options.subCode || 'default'}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);

        window.Tawk_API.onLoad = () => {
            this.chatIsLoad = true;

            if (this.options?.hidden) {
                this.hiddenChatStart();
            }
        };
    }

    protected hiddenChatStart(): void {
        window.Tawk_API.hideWidget();
    }
}
