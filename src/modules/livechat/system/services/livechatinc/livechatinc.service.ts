import {
    Injectable,
    Inject,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {DOCUMENT} from '@angular/common';

import {skipWhile} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import _assign from 'lodash-es/assign';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {ILivechatIncConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {
    LivechatAbstract,
    ChatState,
} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class LivechatincService extends LivechatAbstract<ILivechatIncConfig> {
    public chatId = 'chat-widget-container';
    public canChatDestroy = true;
    protected profile: UserProfile;
    protected firstInit: boolean = true;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
        protected router: UIRouter,
    ) {
        super(document, eventService, router, configService);
    }

    /**
     * Check chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        const chatEl = this.document.getElementById(this.chatId);
        return chatEl
            && this.window.LC_API
            && this.window.LC_API.is_loaded
            && this.window.LC_API.is_loaded();
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        try {
            this.window.LC_API.open_chat_window();
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
            return this.window.LC_API.chat_window_minimized();
        } catch {
            return false;
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        try {
            this.window.LC_API.minimize_chat_window();
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Hides chat widget button
     */
    public hideWidget(): void {
        try {
            this.window.LC_API.hide_chat_window();
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

    /**
     * destroy chat widget
     */
    public destroyWidget(): void {
        this.window['LiveChatWidget']?.call('destroy');
        this.document.head.querySelector('#LivechatincScript').remove();
        this.document.head.querySelector('#LivechatincScriptSdk').remove();
        this.document.head.querySelector('#incInnerScript').remove();
    }

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public rerunWidget(): void {
        this.initChat();
    }

    protected initChat(): void {
        this.chatState$ = new BehaviorSubject(null);

        if (this.options.type !== 'livechatinc' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && this.window.WLC_ENV) {
            return;
        }

        this.window.__lc = {};
        this.window.__lc.license = this.options.code;
        _assign(this.window.__lc, this.options.livechatincSetup);

        const script = this.document.createElement('script');
        script.id = 'LivechatincScript';
        script.type = 'text/javascript';
        script.async = true;
        // script from https://my.livechatinc.com/settings/code
        script.text = ';(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],' +
        '_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},' +
        'off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget]' +
        ' You can\'t use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",' +
        'c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",' +
        'n.src="https://cdn.livechatinc.com/tracking.js",n.id="incInnerScript",t.head.appendChild(n)}};' +
        '!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))';

        this.document.head.appendChild(script);

        const scriptSdk = this.document.createElement('script');
        scriptSdk.id = 'LivechatincScriptSdk';
        scriptSdk.type = 'text/javascript';
        scriptSdk.src = 'https://unpkg.com/@livechat/livechat-visitor-sdk@0.35.2/dist/livechat-visitor-sdk.min.js';

        this.document.head.appendChild(scriptSdk);

        this.window.LC_API = {};

        this.window.LC_API.on_after_load = () => {
            this.chatState$.next(ChatState.loaded);
            if (this.options.setUserDetails && this.firstInit) {
                this.setHandlers();
                this.firstInit = false;
            }
        };

        this.window.LC_API.on_chat_window_opened = () => {
            this.chatState$.next(ChatState.opened);
        };

        this.window.LC_API.on_chat_window_minimized = () => {
            this.chatState$.next(ChatState.minimized);
        };

        this.window.LC_API.on_chat_window_hidden = () => {
            this.chatState$.next(ChatState.hidden);
        };

        this.window.LC_API.on_chat_started = () => {
            this.chatState$.next(ChatState.started);
        };

        this.window.LC_API.on_chat_ended = () => {
            this.chatState$.next(ChatState.ended);
        };

        if (this.options.hidden) {
            this.hiddenChatStart();
        }
    }

    protected setUserDetail(): void {
        if (this.chatIsLoaded()) {
            if (this.profile.email) {
                const userEmail = this.profile.email;
                const userName = this.profile.firstName + ' ' + this.profile.lastName;

                if (this.window.LiveChatWidget) {
                    this.window.LiveChatWidget.call('set_customer_name', userName);
                    this.window.LiveChatWidget.call('set_customer_email', userEmail);
                }
                this.window.LC_API.set_visitor_email(userEmail);
                this.window.LC_API.set_visitor_name(userName);
            } else {
                if (this.window.LiveChatWidget) {
                    this.window.LiveChatWidget.call('set_customer_name', 'unknown');
                    this.window.LiveChatWidget.call('set_customer_email', 'unknown');
                }
                this.window.LC_API.set_visitor_email('unknown');
                this.window.LC_API.set_visitor_name('unknown');
            }
        }
    }

    protected setHandlers(): void {
        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');
        userProfile$.pipe(skipWhile(v => !v))
            .subscribe((profile) => {
                this.profile = profile;
                this.setUserDetail();
            });
    }

    protected hiddenChatStart(): void {
        let livechatStarted = false;

        this.window.LC_API.on_before_load = () => {
            if (!this.window.LC_API.visitor_engaged() && !livechatStarted) {
                this.window.LC_API.hide_chat_window();
            }
        };

        this.window.LC_API.on_chat_started = () => {
            livechatStarted = true;
        };
    }
}
