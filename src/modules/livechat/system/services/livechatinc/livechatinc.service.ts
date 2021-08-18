import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {skipWhile} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {
    LivechatAbstract,
    ChatState,
} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';

@Injectable({
    providedIn: 'root',
})
export class LivechatincService extends LivechatAbstract {
    public chatId = 'chat-widget-container';

    protected options: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');
    protected isAuth: boolean;
    protected profile: UserProfile;

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
        const chatEl = this.document.getElementById(this.chatId);
        return chatEl
            && window.LC_API
            && window.LC_API.is_loaded
            && window.LC_API.is_loaded();
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        try {
            window.LC_API.open_chat_window();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Check chat window is closed
     *
     * @returns {boolean} true or false
     */
    public chatIsMinimized(): boolean {
        try {
            return window.LC_API.chat_window_minimized();
        } catch {
            return false;
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        try {
            window.LC_API.minimize_chat_window();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Hides chat widget button
     */
    public hideWidget(): void {
        try {
            window.LC_API.hide_chat_window();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Shows hidden chats widget button
     */
    public showWidget(): void {
        this.hideChat();
    }

    protected initChat(): void {
        this.chatState$ = new BehaviorSubject(null);

        if (this.options.type !== 'livechatinc' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && window.WLC_ENV) {
            return;
        }

        window.__lc = {};
        window.__lc.license = this.options.code;

        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = ('https:' == this.document.location.protocol
            ? 'https://'
            : 'http://'
        ) + 'cdn.livechatinc.com/tracking.js';


        this.document.head.appendChild(script);

        const scriptSdk = this.document.createElement('script');
        scriptSdk.type = 'text/javascript';
        scriptSdk.src = 'https://unpkg.com/@livechat/livechat-visitor-sdk@0.35.2/dist/livechat-visitor-sdk.min.js';

        this.document.head.appendChild(scriptSdk);

        window.LC_API = {};

        window.LC_API.on_after_load = () => {
            this.chatState$.next(ChatState.loaded);
            if (this.options.setUserDetails) {
                this.setHandlers();
            }
        };

        window.LC_API.on_chat_window_opened = () => {
            this.chatState$.next(ChatState.opened);
        };

        window.LC_API.on_chat_window_minimized = () => {
            this.chatState$.next(ChatState.minimized);
        };

        window.LC_API.on_chat_window_hidden = () => {
            this.chatState$.next(ChatState.hidden);
        };

        window.LC_API.on_chat_started = () => {
            this.chatState$.next(ChatState.started);
        };

        window.LC_API.on_chat_ended = () => {
            this.chatState$.next(ChatState.ended);
        };

        if (this.options.hidden) {
            this.hiddenChatStart();
        }
    }

    protected setUserDetail(): void {
        if (this.chatIsLoaded()) {
            if (this.isAuth) {
                const userEmail = this.profile.email || 'unknown',
                    userName = this.profile.firstName + ' ' + this.profile.lastName;

                window.LC_API.set_visitor_email(userEmail);
                window.LC_API.set_visitor_name(userName);
            } else {
                window.LC_API.set_visitor_email('unknown');
                window.LC_API.set_visitor_name('unknown');
            }
        }
    }

    protected setHandlers(): void {
        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');
        userProfile$.pipe(skipWhile(v => !v))
            .subscribe((profile) => {
                this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
                this.profile = profile;
                this.setUserDetail();
            });
    }

    protected hiddenChatStart(): void {
        let livechatStarted = false;

        window.LC_API.on_before_load = () => {
            if (!window.LC_API.visitor_engaged() && !livechatStarted) {
                window.LC_API.hide_chat_window();
            }
        };

        window.LC_API.on_chat_started = () => {
            livechatStarted = true;
        };
    }
}
