import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {UIRouter} from '@uirouter/core';

import {filter} from 'rxjs/operators';

import {
    ConfigService,
    EventService,
    LogService,
    InjectionService,
} from 'wlc-engine/modules/core';

import {
    UserInfo,
    UserService,
} from 'wlc-engine/modules/user';

import {IIntercomSetup} from 'wlc-engine/modules/external-services/system/interfaces/intercom.interface';

import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class IntercomService {

    protected config: IIntercomSetup = this.configService.get<IIntercomSetup>('$base.intercom');
    protected isAuth: boolean;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        protected logService: LogService,
        protected configService: ConfigService,
        protected router: UIRouter,
        protected injectionService: InjectionService,
    ) {
        this.init();
    }

    protected init(): void {
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.loadIntercom();
        this.bootIntercom();

        if (this.config.sendUserInfo) {

            if (this.isAuth) {
                this.getUserInfo();
            } else {
                this.setHandlersUserInfo();
            }
        }
        this.setLogoutHandler();
    }

    /**
     * Reboot Intercom in anonymous visitor mode
     *
     */

    protected setLogoutHandler(): void {
        const logout = this.eventService.subscribe([
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = false;
            this.shutdownIntercom();
            this.bootIntercom();

            if (this.config.sendUserInfo) {
                this.setHandlersUserInfo();
            }
            logout.unsubscribe();
        });
    }

    /**
     * Reboot Intercom in user visitor mode after get UserInfo
     *
    */

    protected setHandlersUserInfo(): void {
        const login = this.eventService.subscribe([
            {name: 'LOGIN'},
        ], () => {
            this.isAuth = true;
            this.getUserInfo();
            login.unsubscribe();
            this.setLogoutHandler();
        });
    }

    protected loadIntercom(): void {
        this.window.intercomSettings = {
            api_base: 'https://api-iam.intercom.io',
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

        this.router.transitionService.onSuccess({}, () => {
            this.updateIntercom();
        });
    }

    protected async getUserInfo(): Promise<void> {
        const userService = await this.injectionService.getService<UserService>('user.user-service');
        const userInfoSubscribe = userService.userInfo$
            .pipe(filter((userInfo: UserInfo): boolean => !!userInfo && userInfo.dataReady))
            .subscribe((userInfo: UserInfo): void => {
                if (!userInfo) {
                    return;
                }
                this.bootIntercom({
                    email: userInfo.email,
                    name: `${userInfo.firstName || null} ${userInfo.lastName || null}`,
                    user_id: userInfo.loyalty.IDUser,
                });
                userInfoSubscribe.unsubscribe();
            });
    }

    /**
    * Initialize Intercom
    *
    */

    protected bootIntercom(options = {}): void {
        try {
            this.window.Intercom('boot', {app_id: this.config.appId, ...options});
        } catch (error) {
            this.logService.sendLog({code: '23.0.1', data: error});
        }
    }

    /**
    *  1. Send an update to Intercom to create an impression on the current URL
    *  2. Fetch any messages that should be delivered based on the URL and user
    *
    */

    protected updateIntercom(): void {
        try {
            this.window.Intercom('update');
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
}
