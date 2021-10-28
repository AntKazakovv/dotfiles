import {
    Inject,
    Injectable,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';
import {
    Subscription,
    fromEvent,
    of,
} from 'rxjs';
import {
    mergeMap,
    throttleTime,
} from 'rxjs/operators';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
@Injectable({
    providedIn: 'root',
})
export class IdleService {

    protected timer: ReturnType<typeof setTimeout>;
    protected timerSubscription: Subscription;
    protected transitionEnter: Function;
    protected transitionLeft: Function;

    constructor(
        protected configService: ConfigService,
        protected userService: UserService,
        protected router: UIRouterGlobals,
        protected transition: TransitionService,
        protected eventService: EventService,
        protected modalService: ModalService,
        @Inject(DOCUMENT) protected document: Document,
    ) {
    }

    public init(): void {
        this.checkUserIdle();
        this.eventService.filter({name: 'LOGOUT'}).subscribe({
            next: () => {
                this.clearSubscrition();
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
        const isGamePlayState = this.router.current.name === 'app.gameplay';
        this.createDefaultHandler(isGamePlayState);

        this.transitionEnter = this.transition.onEnter({to: 'app.gameplay'}, () => {
            this.createDefaultHandler(true);
        });
        this.transitionLeft = this.transition.onExit({from: 'app.gameplay'}, () => {
            this.createDefaultHandler(false);
        });
    }

    private runTimer(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(
            () => {
                this.userService.logout();
                this.modalService.showModal({
                    id: 'idle-logout-info',
                    modalTitle: gettext('Info'),
                    modifier: 'info',
                    modalMessage: [
                        gettext('You have been inactive for 30 minutes.'),
                        gettext('For your safety, you have been logged out of your account.'),
                    ],
                    textAlign: 'center',
                    dismissAll: true,
                });
                this.clearSubscrition();
            }, 30 * 60 * 1000); // 30 minutes
    }

    private clearSubscrition(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = null;
        this.transitionEnter();
        this.transitionLeft();
    }

    private createDefaultHandler(useMouseMove: boolean): void {
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = fromEvent(this.document, 'click').pipe((
            mergeMap((event) => {
                if (useMouseMove) {
                    return fromEvent(this.document, 'mousemove').pipe(
                        throttleTime(1000),
                    );
                }
                return of(event);
            })
        )).subscribe(() => {
            this.runTimer();
        });
    };
}
