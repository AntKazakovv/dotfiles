import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Optional,
    QueryList,
    Self,
    ViewChildren,
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Observable} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {INotification, NotificationService} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import * as Params from 'wlc-engine/modules/core/system/services/notification/notification.params';

export const HIDE_ANIMATION_DURATION: number = 300;
export const SHIFT_ANIMATION_DURATION: number = 300;
export const DISMISS_ANIMATION_DURATION: number = 150;
const SHIFT_EASING: string = 'ease-in-out';

@Component({
    selector: '[wlc-notification-thread]',
    templateUrl: './notification-thread.component.html',
    styleUrls: ['./styles/notification-thread.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('hide', [
            state('true', style({opacity: '0', visibility: 'hidden'})),
            transition('false <=> true', animate(`${HIDE_ANIMATION_DURATION}ms ease-in-out`)),
        ]),
        trigger('thread', [
            state('dismiss', style({transform: 'scale(0)', opacity: '0'})),
            state('shift',
                style({transform: 'translateY({{amount}})'}),
                {params: {amount: 0}},
            ),
            transition('* => dismiss', animate(`${DISMISS_ANIMATION_DURATION}ms ${SHIFT_EASING}`)),
            transition('* => shift', animate(`${SHIFT_ANIMATION_DURATION}ms ${SHIFT_EASING}`)),
        ]),
    ],
})
export class NotificationThreadComponent extends AbstractComponent {

    @ViewChildren('notification')
    public threadItemList: QueryList<ElementRef<HTMLLIElement>>;

    @HostBinding('attr.aria-label')
    public readonly label: string = 'Notifications';

    @HostBinding('style.z-index')
    public get zIndex(): number {
        return this.$params.zIndex;
    };

    public $params: Params.INotificationParams;

    public get notifications$(): Observable<INotification[]> {
        return this.notificationService.notifications$;
    }

    public disableDismissTimer(notification: INotification): void {
        this.notificationService.disableDismissTimer(notification);
    }

    public resetDismissTimer(notification: INotification): void {
        this.notificationService.resetDismissTimer(notification);
    }

    constructor (
        protected notificationService: NotificationService,
        protected configService: ConfigService,
        @Inject('injectParams')
        @Optional() @Self()
        params: Params.INotificationParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService);
    }
}
