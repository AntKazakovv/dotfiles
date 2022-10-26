import {
    Injectable,
    Inject,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {DOCUMENT} from '@angular/common';

import {
    skipWhile,
    take,
    filter,
    first,
} from 'rxjs/operators';
import {
    BehaviorSubject,
    interval,
    Subscription,
    firstValueFrom,
} from 'rxjs';
import _assign from 'lodash-es/assign';
import {TranslateService} from '@ngx-translate/core';

import {
    GlobalHelper,
    EventService,
    ConfigService,
    LogService,
} from 'wlc-engine/modules/core';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {
    UserInfo,
    UserProfile,
} from 'wlc-engine/modules/user';
import {
    ILivechatIncConfig,
    IUserDataLiveChatInc,
} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {
    LivechatAbstract,
    ChatState,
} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

export type AssignType = 'loyalty' | 'tag';

@Injectable({
    providedIn: 'root',
})
export class LivechatincService extends LivechatAbstract<ILivechatIncConfig> {
    public chatId = 'chat-widget-container';
    public canChatDestroy = true;
    protected profile: UserProfile;
    protected firstInit: boolean = true;
    protected intervalSendParams$: Subscription;
    protected userInfo: UserInfo;
    private userData: IUserDataLiveChatInc;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
        protected router: UIRouter,
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
        const chatEl = this.document.getElementById(this.chatId);
        return chatEl && this.window.LC_API;
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
        this.document.head.querySelector('#LivechatincScript')?.remove();
        this.document.head.querySelector('#LivechatincScriptSdk')?.remove();
        this.document.head.querySelector('script[src="https://cdn.livechatinc.com/tracking.js"]')?.remove();
    }

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public rerunWidget(): void {
        this.initChat();
    }

    protected async initChat(): Promise<void> {
        if (this.configService.get<boolean>('$user.isAuthenticated')
            && (this.options.sendUserParams || this.options.assignUsersByGroup)
        ) {
            const userInfo$ = this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'});
            this.userInfo = userInfo$.value ?? await firstValueFrom(userInfo$.pipe(first((v) => !!v)));
            const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');
            this.profile = userProfile$.value ?? await firstValueFrom(userProfile$.pipe(first((v) => !!v)));
        }
        this.initialize();
    }

    protected async initialize(): Promise<void> {
        this.chatState$ = new BehaviorSubject(null);

        if (this.options.type !== 'livechatinc' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && this.window.WLC_ENV) {
            return;
        }

        if (this.isExcludeStates) {
            return;
        }

        this.window.__lc = {};
        this.window.__lc.license = this.options.code;

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            if (this.options.sendUserParams) {
                this.subscribeUserInfo();
            }

            if (this.options.assignUsersByGroup) {
                this.window.__lc.group = await this.checkSettingsUserGroup();
            }
        } else {

            if (this.options.assignUsersByGroup) {
                this.window.__lc.group = this.options.assignUsersByGroup.defaultGroup;
            }

            this.eventService.subscribe([
                {name: 'LOGIN'},
            ], () => {
                this.destroyWidget();
                this.initChat();
            });
        }

        if (this.options.openChatOnContactUs) {
            this.eventService.subscribe({
                name: 'OPEN_LIVECHAT',
            }, () => {
                if (this.window.LiveChatWidget) {
                    this.openChat();
                }
            });
        }

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
            'n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};' +
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

            if (this.options.openChatOnContactUs
                && this.router.globals.current.name === 'app.contacts'
                && this.window.LiveChatWidget
            ) {
                this.openChat();
            }
        };

        this.window.LC_API.on_chat_window_opened = () => {
            this.chatState$.next(ChatState.opened);

            if (this.options.sendUserParams) {
                this.sendUserDetails(this.options?.intervalSendParams);
            }
        };

        this.window.LC_API.on_chat_window_minimized = () => {
            this.chatState$.next(ChatState.minimized);

            if (this.options.sendUserParams) {
                this.stopSendUserDetails();
            }
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

        this.translateService.onLangChange
            .pipe(take(1))
            .subscribe(() => {
                this.destroyWidget();
            });

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

    protected async checkSettingsUserGroup(): Promise<string> {
        const name = this.options.assignUsersByGroup?.byTags ? 'tag' : 'loyalty';
        return this.getUserGroup(name);
    }

    protected async subscribeUserInfo(): Promise<void> {
        this.configService.get<BehaviorSubject<UserInfo>>(
            {name: '$user.userInfo$'},
        ).pipe(filter((v) => !!v))
            .subscribe((userInfo) => {
                this.userInfo = userInfo;
            });
    }

    protected sendUserDetails(sendInterval?: number): void {
        this.collectingUserData();
        this.intervalSendParams$ = interval(sendInterval * 60 * 1000 || 60000)
            .subscribe(() => {
                this.refreshDataCollection();
            });
    }

    protected stopSendUserDetails(): void {
        if (this.intervalSendParams$) {
            this.intervalSendParams$.unsubscribe();
        }
    }

    protected get fundistLink(): string {
        const prodLink = this.options.fundistProdLink || 'fundist.org';
        switch (this.window.WLC_ENV) {
            case 'dev' || 'qa':
                return 'https://qa.fundist.org/Users/Summary/';
            case 'test':
                return 'https://test.fundist.org/Users/Summary/';
            default:
                return `https://${prodLink}/Users/Summary/`;
        }
    }

    protected async collectingUserData(): Promise<void> {
        if (this.userInfo && this.profile) {
            this.userData = {
                lastDepositDate: await this.getLastDepositDate(),
                project: this.configService.get('$base.site.name'),
                userId: this.userInfo.idUser ? `${this.fundistLink + this.userInfo.idUser}` : null,
                name: this.userInfo.firstName || null,
                surname: this.userInfo.lastName || null,
                email: this.userInfo.email || null,
                userTag: this.getUserTag(),
                phone: `${this.profile.phoneCode || null} ${this.profile.phoneNumber || null}`,
                userTime: new Date().toLocaleTimeString().slice(0, -3),
                language: this.configService.get<string>('appConfig.language'),
                deviceType: this.configService.get<boolean>('appConfig.mobile') ? 'mobile' : 'desktop',
                siteUrl: this.configService.get<string>('appConfig.site'),
                loyaltyLevel: `${this.userInfo.loyalty.Level}-${this.userInfo.loyalty.LevelName.en}`,
            };

            if (this.window.LiveChatWidget) {
                this.window.LiveChatWidget.call('set_session_variables', this.userData);
            }
        }
    }

    protected async refreshDataCollection(): Promise<void> {

        if (!this.userData) {
            await this.collectingUserData();
        }

        this.userData.lastDepositDate = await this.getLastDepositDate();
        this.userData.userTime = new Date().toLocaleTimeString().slice(0, -3);
        this.userData.loyaltyLevel = `${this.userInfo.loyalty.Level}-${this.userInfo.loyalty.LevelName.en}`;

        if (this.window.LiveChatWidget) {
            this.window.LiveChatWidget.call('set_session_variables', this.userData);
        }
    }

    protected async getLastDepositDate(): Promise<string> {
        const allTransactions = await this.financesService.getTransactionList();

        if (!allTransactions.length) {
            return 'No transactions';
        }
        const lastSuccessDep = allTransactions.find(transaction =>
            transaction.statusCode === 100 &&
            transaction.type === 'Credit');

        return lastSuccessDep ?
            GlobalHelper.toLocalTime(lastSuccessDep.dateISO, 'ISO', 'HH:mm:ss dd-MM-yyyy') : 'No success deposits';
    }

    private getUserTag(): string | string[] {
        if (this.options.assignUsersByGroup?.byTags) {
            const tagsConfig = Object.values(this.options.assignUsersByGroup.byTags);
            const tagsUserInfo = Object.keys(this.userInfo.tags);
            let userTag: string;

            tagsConfig.forEach((tagConfig) => {
                tagsUserInfo.forEach((key) => {
                    if (tagConfig.includes(key)) {
                        userTag = this.userInfo.tags[key];
                    }
                });
            });
            return userTag || 'Other';
        } else {
            return Object.values(this.userInfo.tags) || 'No tag';
        }
    }

    private getUserGroup(assignBy: AssignType): string {
        let userGroup: string = this.options.assignUsersByGroup.defaultGroup;

        switch (assignBy) {
            case 'tag':
                Object.keys(this.userInfo.tags)?.forEach((tag) => {
                    for (let key in this.options.assignUsersByGroup?.byTags) {
                        if (this.options.assignUsersByGroup?.byTags[key].includes(tag)) {
                            userGroup = key;
                        }
                    }
                });
            case 'loyalty':
                const levelLoyalty = this.userInfo.loyalty.Level;
                if (levelLoyalty) {
                    for (let key in this.options.assignUsersByGroup?.byLoyaltyLevel) {
                        if (this.options.assignUsersByGroup?.byLoyaltyLevel[key].includes(levelLoyalty)) {
                            userGroup = key;
                        }
                    }
                }
        }
        return userGroup;
    }
}
