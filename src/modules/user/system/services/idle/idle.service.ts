import {
    Inject,
    Injectable,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    StateService,
    TransitionService,
} from '@uirouter/core';
import {
    Subscription,
    fromEvent,
    interval,
    merge,
} from 'rxjs';
import {
    debounceTime,
    filter,
    map,
} from 'rxjs/operators';

import {
    IIdleConfig,
    TUnknownFunction,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

const oneMinute: number = 60000 as const;

@Injectable({
    providedIn: 'root',
})
export class IdleService {

    public isActivityAfterSendUserInfo: boolean = false;

    protected timer: ReturnType<typeof setTimeout>;
    protected timerSubscription: Subscription;
    protected transitionEnter?: TUnknownFunction;
    protected transitionLeft?: TUnknownFunction;
    protected config: IIdleConfig;

    constructor(
        protected configService: ConfigService,
        protected userService: UserService,
        protected transition: TransitionService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected stateService: StateService,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
    ) {}

    public init(): void {
        this.config = this.configService.get<IIdleConfig>('$base.idle');

        if (this.configService.get<string>('appConfig.license') === 'italy'
            || this.configService.get('$base.profile.autoLogout.use')
        ) {
            this.config.idleTime = (this.userService.userProfile.logoutTime ?? 20) * oneMinute;
            this.config.frequencyChecks = oneMinute / 20;
            this.userService.userProfile$
                .pipe(
                    filter((profile) => !!profile.logoutTime),
                    map((profile) => profile.logoutTime),
                ).subscribe((idleTime: number) => {
                    this.config.idleTime = idleTime * oneMinute;
                });
        }

        this.checkUserIdle();
        this.eventService.filter({name: 'LOGOUT'}).subscribe({
            next: () => {
                this.clearSubscription();
            },
        });
    }

    /**
     * Method uses for MGA license, after 30 min of user's idle call logout;
     *
     * @method checkUserIdle
     */
    private checkUserIdle(): void {
        this.runTimer();
        this.createDefaultHandler();
    }

    private runTimer(): void {
        if (!this.document.hidden) {
            this.configService.set({
                name: 'idle',
                value: new Date().toString(),
                storageType: 'localStorage',
            });
        }
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.logout();
        }, this.config.idleTime);
    }

    private logout(): void {
        this.configService.set({
            name: 'idle-logout',
            value: new Date().toString(),
            storageType: 'localStorage',
        });

        this.stateService.go('app.home').transition.promise
            .catch(() => {})
            .finally(() => {
                this.userService.logout();
                this.showModal();
                this.clearSubscription();
            });
    }

    private clearSubscription(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = null;
        this.transitionEnter?.();
        this.transitionLeft?.();
    }

    private showModal(): void {
        if (this.configService.get<string>('appConfig.license') === 'italy'
            || this.configService.get('$base.profile.autoLogout.use')
        ) {
            this.modalService.showModal({
                id: 'idle-auto-logout-info',
                modalTitle: gettext('The session has expired'),
                modifier: 'info',
                modalMessage: gettext('You have been inactive on the site for longer than the set time'),
                textAlign: 'center',
                showFooter: true,
                showConfirmBtn: true,
                rejectBtnVisibility: false,
                iconPath: '/wlc/icons/status/alert.svg',
                confirmBtnText: gettext('Ok'),
                dismissAll: true,
            });
        } else {
            this.modalService.showModal({
                id: 'idle-logout-info',
                modalTitle: gettext('Info'),
                modifier: 'info',
                modalMessage: this.config.idleMessage,
                textAlign: 'center',
                dismissAll: true,
            });
        }
    }

    private createDefaultHandler(): void {
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = merge(
            fromEvent(this.document, 'click').pipe(
                debounceTime(this.config.frequencyChecks),
            ),
            fromEvent(this.document, 'mousemove').pipe(
                debounceTime(this.config.frequencyChecks),
            ),
            fromEvent(this.window, 'storage'),
            interval(this.config.frequencyChecks).pipe(
                map((): string => this.document.activeElement.tagName),
                filter(((el: string): boolean => !this.document.hidden && el === 'IFRAME')),
            ),
        ).subscribe((event: StorageEvent | PointerEvent | MouseEvent): void => {
            this.isActivityAfterSendUserInfo = true;
            if ((event as StorageEvent)['key'] === 'ngx-webstorage|idle-logout') {
                this.logout();
            } else {
                this.runTimer();
            }
        });
    };
}
