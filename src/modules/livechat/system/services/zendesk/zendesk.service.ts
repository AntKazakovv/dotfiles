import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';
import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    filter,
} from 'rxjs';
import _set from 'lodash-es/set';

import {
    EventService,
    ConfigService,
    LogService,
    DataService,
    IData,
    IEvent,
} from 'wlc-engine/modules/core';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {
    ChatState,
    LivechatAbstract,
} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {UserInfo}  from 'wlc-engine/modules/user/system/models/info.model';

interface IChatJwt {
    chat: {
        jwtFn: (callback: (token: string) => void) => void,
    }
}

@Injectable({providedIn: 'root'})
export class ZendeskService extends LivechatAbstract {
    public canChatDestroy = false;

    protected options: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');
    protected chatJwtFn: IChatJwt = {
        chat: {
            jwtFn: async (callback: (token: string) => void): Promise<void> => {
                callback(await this.getToken());
            },
        },
    };

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private translateService: TranslateService,
        private dataService: DataService,
    ) {
        super(document, eventService);
    }

    /**
     * Check if chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return !!this.window.zE && this.window.zEACLoaded;
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        try {
            this.window.zE('webWidget', 'show');
            this.window.zE('webWidget', 'open');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Show hidden chat widget
     */
    public showWidget(): void {
        try {
            this.window.zE('webWidget', 'show');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Close chat window
     */
    public hideChat(): void {
        try {
            this.window.zE('webWidget', 'close');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Hide chat widget
     */
    public hideWidget(): void {
        try {
            this.window.zE('webWidget', 'hide');
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
        this.hideWidget();
    }

    /**
     * Toggle chat window
     */
    public toggleChat(): void {
        try {
            this.window.zE('webWidget', 'toggle');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    protected initChat(): void {
        this.chatState$ = new BehaviorSubject(null);

        if (this.options.type !== 'zendesk' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && this.window.WLC_ENV) {
            return;
        }

        const script = this.document.createElement('script');
        script.async = true;
        script.id = 'ze-snippet';
        script.src = 'https://static.zdassets.com/ekr/snippet.js?key=' + this.options.code;

        if (this.configService.get<boolean>('$user.isAuthenticated') && this.options.zESettings?.webWidget) {
            _set(this.options.zESettings, 'webWidget.authenticate', this.chatJwtFn);
        }

        this.window.zESettings = this.options.zESettings || {};

        script.onload = () => {
            this.window.zE('webWidget:on', 'chat:connected', () => {
                this.chatState$.next(ChatState.loaded);
                this.window.zE(
                    'webWidget',
                    'setLocale',
                    this.translateService.currentLang || 'en',
                );
                if (this.options?.hidden) {
                    this.hideWidget();
                }
            });

            this.window.zE('webWidget:on', 'chat:start', () => {
                this.chatState$.next(ChatState.started);
            });

            this.window.zE('webWidget:on', 'chat:end', () => {
                this.chatState$.next(ChatState.ended);
            });

            this.window.zE('webWidget:on', 'close', () => {
                this.chatState$.next(ChatState.minimized);
            });

            this.window.zE('webWidget:on', 'open', () => {
                this.chatState$.next(ChatState.opened);
            });

            this.setHandlers();
        };

        this.document.head.appendChild(script);
    }

    /**
     * Authentication in chat after login and exit from chat after logout
     */
    protected initEvents(): void {
        super.initEvents();

        this.eventService.filter([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ]).subscribe((event: IEvent<IData>) => {
            if (this.chatIsLoaded()) {
                switch (event.name) {
                    case 'LOGIN':
                        this.updateSettings();
                        break;
                    case 'LOGOUT':
                        this.window.zE('webWidget', 'logout');
                        break;
                }
            }
        });
    }

    protected setHandlers(): void {
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.window.zE(
                'webWidget',
                'setLocale',
                event.lang,
            );
        });

        this.watchForUserInfo();
    }

    protected addTags(tags: string[]): void {
        this.window.zE('webWidget', 'chat:addTags', tags);
    }

    protected updateSettings(): void {
        this.window.zE(
            'webWidget',
            'updateSettings',
            {
                webWidget: {
                    authenticate: this.chatJwtFn,
                },
            },
        );
        this.window.zE('webWidget', 'chat:reauthenticate');
    }

    protected watchForUserInfo(): void {
        const comparingKeys: (keyof UserInfo)[] = [
            'idUser',
            'firstName',
            'lastName',
            'email',
            'balance',
            'loyalty',
        ];

        this.configService
            .get<BehaviorSubject<UserInfo>>('$user.userInfo$')
            .pipe(
                filter((user) => !!user),
                distinctUntilChanged<UserInfo>((prev, curr) => comparingKeys.every((k) => prev[k] === curr[k])),
            )
            .subscribe((user: UserInfo) => this.addUserInfoTags(user));
    }

    protected addUserInfoTags(user: UserInfo): void {
        const fullName = `${user.firstName} ${user.lastName}`;
        const depositsCount = user.loyalty.DepositsCount || '0';

        this.addTags([
            user.idUser,
            fullName,
            user.email,
            String(user.balance),
            depositsCount,
        ]);
    }

    protected async getToken(): Promise<string> {
        try {
            return await this.dataService.request<IData>({
                name: 'token',
                system: 'zendesk',
                url: '/zendesk',
                type: 'GET',
            }).then((data) => data.data);
        } catch (error) {
            this.logService.sendLog({
                code: '0.0.12',
                data: error,
                from: {
                    service: 'ZendeskService',
                    method: 'getToken',
                },
            });
        }
    }
}
