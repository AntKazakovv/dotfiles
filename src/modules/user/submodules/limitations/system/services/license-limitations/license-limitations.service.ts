import {Injectable} from '@angular/core';

import {
    StateService,
    Transition,
    UIRouter,
    UIRouterGlobals,
} from '@uirouter/core';
import {
    BehaviorSubject,
    Subscription,
    filter,
    first,
    firstValueFrom,
} from 'rxjs';

import {
    ConfigService,
    EventService,
    IData,
    IEvent,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';

const userInfoStatusDisable: number = 2 as const;

@Injectable({
    providedIn: 'root',
})
export class LicenseLimitationsService {

    private availableStatesList: string[] = [];
    private userInfoSubscribe: Subscription;
    private transitionOnBeforeDestroy: Function;

    constructor(
        private configService: ConfigService,
        private eventService: EventService,
        private router: UIRouter,
        private uiRouter: UIRouterGlobals,
        private stateService: StateService,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        switch (this.configService.get<string>('appConfig.license')) {
            case 'malta':
                this.availableStatesList = this.configService.get({name: '$base.maltaSelfExclusionAvailableStates'});
                break;
            case 'romania':
                this.availableStatesList = this.configService.get({name: '$base.romaniaSelfExclusionAvailableStates'});
                break;
        }

        this.listenAuthEvents();
        this.listenUserInfo();
        this.transitionOnBeforeDestroy = this.onBeforeHook();
    }

    private onBeforeHook(): Function {
        return this.router.transitionService.onBefore({}, async (trans: Transition) => {
            if (!this.checkState(trans.to().name)) {
                const userInfo: UserInfo = await firstValueFrom(
                    this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                        .pipe(first((userInfo: UserInfo): boolean => !!userInfo?.idUser)),
                );
                if (this.shouldModalBeShown(userInfo)) {
                    this.showTransitionDenied();
                    trans.abort();
                }
            }
        });
    }

    private checkState(state: string): boolean {
        return this.availableStatesList.includes(state);
    }

    private shouldModalBeShown(userInfo: UserInfo): boolean {
        return userInfo.status === 2;
    }

    private showTransitionDenied(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Error'),
                message: gettext(
                    'Unfortunately, you cannot perform this action, since you have requested self-exclusion. ' +
                    'Please, contact technical support service of our casino if you have any questions',
                ),
                wlcElement: 'notification_self-exclusion-transition-denied',
            },
        });
    }

    private listenAuthEvents(): void {
        this.eventService.filter([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ]).subscribe(async (event: IEvent<IData>) => {
            switch (event.name) {
                case 'LOGIN':
                    this.listenUserInfo();
                    this.transitionOnBeforeDestroy = this.onBeforeHook();
                    break;
                case 'LOGOUT':
                    this.userInfoSubscribe.unsubscribe();
                    this.transitionOnBeforeDestroy();
                    break;
            }
        });
    }

    private listenUserInfo(): void {
        this.userInfoSubscribe = this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(filter((userInfo: UserInfo): boolean => !!userInfo?.idUser))
            .subscribe(async (userInfo: UserInfo) => {
                if (userInfo.status === userInfoStatusDisable && !this.checkState(this.uiRouter.current.name)) {
                    this.showTransitionDenied();
                    this.stateService.go('app.home');
                }
            });
    }
}
