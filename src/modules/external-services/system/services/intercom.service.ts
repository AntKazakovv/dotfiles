import {
    Injectable,
    Inject,
    inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    Transition,
    UIRouter,
} from '@uirouter/core';

import {
    BehaviorSubject,
    firstValueFrom,
    first,
} from 'rxjs';
import _includes from 'lodash-es/includes';

import {
    ActionService,
    ConfigService,
    DeviceModel,
    DeviceType,
    EventService,
    LogService,
    InjectionService,
} from 'wlc-engine/modules/core';

import {
    UserInfo,
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';

import {IIntercomSetup} from 'wlc-engine/modules/external-services/system/interfaces/intercom.interface';

import {WINDOW} from 'wlc-engine/modules/app/system';

export interface IUpdateIntercomOptions {
    hide_default_launcher: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class IntercomService {
    protected readonly userService: UserService = inject(UserService);
    protected readonly eventService: EventService = inject(EventService);
    protected readonly logService: LogService = inject(LogService);
    protected readonly configService: ConfigService = inject(ConfigService);
    protected readonly router: UIRouter = inject(UIRouter);
    protected readonly injectionService: InjectionService = inject(InjectionService);
    protected readonly actionService: ActionService = inject(ActionService);
    protected isMobile: boolean = this.configService.get<DeviceModel>('device').isMobile;
    protected config: IIntercomSetup = this.configService.get<IIntercomSetup>('$base.intercom');
    protected isAuth: boolean;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
    ) {
        this.init();
    }

    protected async init(): Promise<void> {
        await this.actionService.userMove;
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.loadIntercom();

        if (this.config.sendUserInfo) {

            if (this.isAuth) {
                await this.getUserInfo();
                this.setLogoutHandler();
            } else {
                this.setHandlersUserInfo();
                this.bootIntercom();
            }
        }

        this.eventService.subscribe({
            name: 'LIVECHAT_OPEN',
        }, () => {
            this.showMessenger();
        });

        if (this.config.excludeOnlyMobile) {
            this.setDeviceTypeSubscribe();
        } else {
            this.checkCurrentState(this.router.globals.current.name);
        }
    }

    /**
     * Reboot Intercom in anonymous visitor mode
     *
     */

    protected setLogoutHandler(): void {
        const logout = this.eventService.subscribe([
            {name: 'LOGOUT'},
        ], () => {
            logout.unsubscribe();
            this.isAuth = false;
            this.shutdownIntercom();
            this.bootIntercom();

            if (this.config.sendUserInfo) {
                this.setHandlersUserInfo();
            }
        });
    }

    /**
     * Reboot Intercom in user visitor mode after get UserInfo
     *
    */

    protected setHandlersUserInfo(): void {
        const login = this.eventService.subscribe([
            {name: 'LOGIN'},
        ], async () => {
            login.unsubscribe();
            this.isAuth = true;
            this.getUserInfo();
            this.setLogoutHandler();
        });
    }

    protected loadIntercom(): void {
        this.window.intercomSettings = {
            api_base: this.config.apiBase || 'https://api-iam.intercom.io',
            app_id: this.config.appId,
        };

        const script = this.document.createElement('script');
        script.id = 'IntercomScript';
        script.type = 'text/javascript';
        script.async = true;
        script.text = '(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function")' +
        '{ic(\'reattach_activator\');ic(\'update\',w.intercomSettings);}else{var d=document;var i=function()' +
        '{i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function()' +
        '{var s=d.createElement(\'script\');s.type=\'text/javascript\';s.async=true;' +
        `s.src='https://widget.intercom.io/widget/${this.config.appId}'; `+
        'var x=d.getElementsByTagName(\'script\')[0]; x.parentNode.insertBefore(s, x);};'+
        'if(document.readyState===\'complete\'){l();} else if(w.attachEvent){w.attachEvent(\'onload\',l);}'+
        'else{w.addEventListener(\'load\',l,false);}}})();';
        this.document.head.appendChild(script);

        this.router.transitionService.onSuccess({}, (transition: Transition) => {
            const stateName: string = transition.targetState().name();
            this.checkCurrentState(stateName);
        });
    }

    protected async getUserInfo(): Promise<void> {
        this.shutdownIntercom();
        await this.userService.fetchUserInfo();
        await this.userService.fetchUserProfile();
        const [userInfo, userProfile] = await Promise.all([
            firstValueFrom(
                this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                    .pipe(
                        first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                    ),
            ),
            firstValueFrom(
                this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
                    .pipe(
                        first((userProfile: UserProfile): boolean => !!userProfile?.idUser),
                    ),
            ),
        ]);


        this.bootIntercom({
            email: userInfo.email,
            name: `${userInfo.firstName || null} ${userInfo.lastName || null}`,
            user_id: userInfo.loyalty.IDUser,
            wlc_login: userProfile.login || null,
        });
    }

    /**
    * Initialize Intercom
    *
    */

    protected bootIntercom(options = {}): void {
        try {
            this.window.Intercom('boot', {
                api_base: this.config.apiBase || 'https://api-iam.intercom.io',
                app_id: this.config.appId,
                ...options,
            });
        } catch (error) {
            this.logService.sendLog({code: '23.0.1', data: error});
        }
    }

    /**
    *  1. Send an update to Intercom to create an impression on the current URL
    *  2. Fetch any messages that should be delivered based on the URL and user
    *
    */

    protected updateIntercom(options?: IUpdateIntercomOptions): void {
        try {
            this.window.Intercom('update', options);
        } catch (error) {
            this.logService.sendLog({code: '23.0.0', data: error});
        }
    }

    /**
    *  Clears user session and unloads messages
    *
    */

    protected shutdownIntercom(): void {
        try {
            this.window.Intercom('shutdown');
        } catch (error) {
            this.logService.sendLog({code: '23.0.0', data: error});
        }
    }

    protected setDeviceTypeSubscribe(): void {
        this.actionService.deviceType().subscribe((type: DeviceType) => {
            this.isMobile = type !== DeviceType.Desktop;
            this.checkCurrentState(this.router.globals.current.name);
        });
    }

    protected checkCurrentState(stateName: string): void {
        if (_includes(this.config.excludeStates, stateName)
            && ((this.config.excludeOnlyMobile && this.isMobile)
                || !this.config.excludeOnlyMobile)) {
            this.updateIntercom({
                hide_default_launcher: true,
            });
            return;
        }

        this.updateIntercom({
            hide_default_launcher: false,
        });
    }

    protected showMessenger(): void {
        try {
            this.window.Intercom('show');
        } catch (error) {
            this.logService.sendLog({code: '23.0.0', data: error});
        }
    }
}
