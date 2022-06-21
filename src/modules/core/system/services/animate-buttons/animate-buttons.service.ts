import {Injectable} from '@angular/core';
import {
    StateService,
    TransitionService,
} from '@uirouter/core';

import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import {
    first,
    takeUntil,
} from 'rxjs/operators';

import {
    TIsFirstAnimateButtonEventByType,
    TAnimateButtonHandlerOnService,
} from 'wlc-engine/modules/core/system/interfaces/animate-buttons.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {UserInfo} from 'wlc-engine/modules/user';

@Injectable({
    providedIn: 'root',
})
export class AnimateButtonsService {

    /**
     * To check that button type animate is first
     */
    public isFirstButtonAnimateEvent: TIsFirstAnimateButtonEventByType = {
        deposit: true,
    };

    constructor(
        private configService: ConfigService,
        private eventService: EventService,
        private transitionService: TransitionService,
        private stateService: StateService,
    ) {
        this.setSubscription();
    }

    private setSubscription(): void {
        this.eventService.subscribe({
            name: 'ANIMATE_BUTTON',
        }, (data: TAnimateButtonHandlerOnService) => {
            switch (data) {
                case 'deposit':
                    this.isFirstButtonAnimateEvent.deposit = false;
                    this.checkUserBalanceAndAnimateDepositButton();
                    break;
            }
        });
    }

    private checkUserBalanceAndAnimateDepositButton(): void {
        const $until = new Subject();
        this.eventService.subscribe({name: 'LOGOUT'}, (): void => {
            $until.next(null);
            $until.complete();
        });

        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(
                first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                takeUntil($until),
            )
            .subscribe((userInfo: UserInfo): void => {
                if (!userInfo.realBalance && !this.stateService.is('app.profile.cash.deposit')) {
                    this.eventService.emit({
                        name: 'START_ANIMATE_BUTTON',
                        data: <TAnimateButtonHandlerOnService>'deposit',
                    });

                    const openDepositStateHandler: Function = this.transitionService.onSuccess(
                        {to: 'app.profile.cash.deposit'},
                        () => {
                            this.eventService.emit({
                                name: 'STOP_ANIMATE_BUTTON',
                                data: <TAnimateButtonHandlerOnService>'deposit',
                            });
                            $until.next(null);
                            $until.complete();
                        },
                        {invokeLimit: 1},
                    );

                    this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                        .pipe(
                            first((userInfo: UserInfo): boolean => !!userInfo.realBalance),
                            takeUntil($until),
                        )
                        .subscribe((): void => {
                            this.eventService.emit({
                                name: 'STOP_ANIMATE_BUTTON',
                                data: <TAnimateButtonHandlerOnService>'deposit',
                            });
                            openDepositStateHandler();
                        });
                }
            });
    }
}
