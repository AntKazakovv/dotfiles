import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {
    LivechatAbstract,
    ChatState,
} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';

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
        try {
            if (window.Tawk_API.isChatHidden()) {
                window.Tawk_API.showWidget();
            }
            window.Tawk_API.maximize();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        try {
            if (window.Tawk_API.isChatMaximized()) {
                window.Tawk_API.minimize();
            }
            window.Tawk_API.hideWidget();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Hides chat widget button
     */
    public hideWidget(): void {
        try {
            window.Tawk_API.hideWidget();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Shows hidden chats widget button
     */
    public showWidget(): void {
        try {
            window.Tawk_API.showWidget();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
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
        this.chatState$ = new BehaviorSubject(null);

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
            this.chatState$.next(ChatState.loaded);
            this.chatIsLoad = true;

            if (this.options?.hidden) {
                this.hideWidget();
            }
        };

        window.Tawk_API.onChatMaximized = () => {
            this.chatState$.next(ChatState.opened);
        };

        window.Tawk_API.onChatMinimized = () => {
            this.chatState$.next(ChatState.minimized);
        };

        window.Tawk_API.onChatHidden = () => {
            this.chatState$.next(ChatState.hidden);
        };

        window.Tawk_API.onChatStarted = () => {
            this.chatState$.next(ChatState.started);
        };

        window.Tawk_API.onChatEnded = () => {
            this.chatState$.next(ChatState.ended);
        };

    }
}
