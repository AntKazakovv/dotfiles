import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    Inject,
    Injectable,
    InjectionToken,
    Injector,
    QueryList,
    Type,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {from, Observable, Subject, Subscription, timer} from 'rxjs';
import {concatMap, delay, map, scan, take} from 'rxjs/operators';

import {
    EventService,
    ConfigService,
    LogService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    DISMISS_ANIMATION_DURATION,
    SHIFT_ANIMATION_DURATION,
    NotificationThreadComponent,
} from 'wlc-engine/modules/core/components/notification-thread/notification-thread.component';
import {MessageComponent} from 'wlc-engine/modules/core/components/message/message.component';
import {
    INotificationMetadata,
    IPushComponentParams,
    IPushMessageParams,
} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {IEvent} from 'wlc-engine/modules/core/system/services/event/event.service';

import * as Params from 'wlc-engine/modules/core/system/services/notification/notification.params';

import {
    findIndex as _findIndex,
    assign as _assign,
    reduce as _reduce,
    concat as _concat,
    last as _last,
    keys as _keys,
    find as _find,
    each as _each,
    map as _map,
} from 'lodash-es';

export type TAnimationState = 'shift' | 'dismiss';

export interface INotification {
    readonly id: number;
    threadAnimationState: TAnimationState;
    threadAnimationValue: string;
    dismissTime: number;
    dismissTimer: Subscription;
    collision: boolean;
    hide: boolean;
    Component: Type<unknown>;
    injector: Injector;
    height?: number;
}

export interface IThreadAction {
    getNextState(prevState: INotification[], waiterResult: unknown): INotification[];
    waiter?: Observable<unknown>;
    displayItems?: number;
}


export const NOTIFICATION_METADATA: InjectionToken<INotificationMetadata>
    = new InjectionToken('Notification meta functionality');

export enum NotificationEvents {
    PushComponent = 'PUSH_NOTIFICATION_COMPONENT',
    PushMessage   = 'PUSH_NOTIFICATION_MESSAGE',
    Dismiss       = 'DISMISS_NOTIFICATION',
}

/**
 * @description
 *
 * Service for displaying notification popups.
 *
 * Automatically bootstrapped into the app.
 *
 * **Attention**: shouldn't be used directly and **cannot** be provided in components. Use it through EventService.
 */
@Injectable({providedIn: 'root'})
export class NotificationService {

    /**
     * @description
     *
     * Number of visible items
     */
    private displayItems: number = 1;

    /**
     * @description
     *
     * Subject that receives a thread action object with next fields:
     *
     * - `waiter`: an observable that `getNextState` is waiting for;
     * - `getNextState`: function that accepts current state of notifications and result of waiter;
     * - `displayItems`: number of notifications that should be visible (takes from service by default).
     */
    private actions$: Subject<IThreadAction[]> = new Subject();

    /**
     * @description
     *
     * Observable, that handles thread actions and provides array of notifications.
     * Makes queue out of actions, for each it waits for waiter, passes its result
     * to getNextState function and emits its return value as the next state.
     */
    public notifications$: Observable<INotification[]> = this.actions$.pipe(
        concatMap((actions) => from(actions)),
        concatMap(({
            waiter = timer(0),
            displayItems = this.displayItems,
            getNextState,
        }) => {
            return waiter.pipe(
                take(1),
                // Make Observable macrotask so Change detector could work appropriately
                delay(0),
                map((waiterResult) => {
                    return {waiterResult, displayItems, getNextState};
                }),
            );
        }),
        scan((state, {waiterResult, displayItems, getNextState}) => {
            const nextState = getNextState(state, waiterResult);

            this.notifications = _map(nextState, (notification, index) => {
                notification.hide = nextState.length - displayItems > index;
                return notification;
            });
            return this.notifications;
        }, <INotification[]>[]),
    );

    private $params: Params.INotificationParams;
    private $init: Subject<void> = new Subject();

    private appRef: ApplicationRef;
    private logService: LogService;

    private notificationsCount: number = 0;
    private notifications: INotification[];
    private threadRef: ComponentRef<NotificationThreadComponent>;

    constructor(
        @Inject(DOCUMENT)
        private document: HTMLDocument,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private configService: ConfigService,
        private eventService: EventService,
    ) {
        this.listenSyncEvents();
        this.init();
    }

    /**
     * @description
     * Since service initializing asynchronously, it cannot process events for awhile.
     * This method is collecting events that was emitted before initialization and processes
     * when initialization is completed.
     */
    private async listenSyncEvents(): Promise<void> {
        const Events = NotificationEvents;
        const eventStack: IEvent<any>[] = [];

        this.eventService.subscribe(
            {name: Events.PushMessage},
            (params: IPushMessageParams) => {
                eventStack.push({
                    name: Events.PushMessage,
                    data: params,
                });
            },
            this.$init,
        );

        this.eventService.subscribe(
            {name: Events.PushComponent},
            (params: IPushComponentParams) => {
                eventStack.push({
                    name: Events.PushMessage,
                    data: params,
                });
            },
            this.$init,
        );

        await this.$init.toPromise();

        _each(eventStack, (event) => {
            if (event.name === Events.PushMessage) {
                this.pushMessage(event.data);
            } else if (event.name === Events.PushComponent) {
                this.pushComponent(event.data);
            }
        });
    }

    public disableDismissTimer(notification: INotification): void {
        notification.dismissTimer.unsubscribe();
    }

    public resetDismissTimer(notification: INotification): void {
        notification.dismissTimer = this.createDismissTimer(notification.id, notification.dismissTime);
    }

    private async init(): Promise<void> {
        await this.configService.ready;

        this.$params = {
            ...Params.defaultParams,
            ...this.configService.get('$modules.core.services.notification'),
        };

        this.injectDependencies();
        this.bootstrapThread();
        this.subscribeOnEvents();
        this.subscribeOnMedia();

        // Wait for Thread Component to be initializer
        setTimeout(() => {
            this.$init.next();
            this.$init.complete();
        });
    }

    /**
     * @description
     *
     * Since service is bootstrapping on application initialization, it
     * (and all its dependencies) cannot inject required ApplicationRef
     * because it yet doesn't exist, but it will be available after
     * config service is ready
     */
    private injectDependencies(): void {
        this.appRef = this.injector.get(ApplicationRef);
        this.logService = this.injector.get(LogService);
    }

    /**
     * @description
     *
     * Notification thread cannot be inserted into template, so service bootstraps it
     * manually.
     */
    private bootstrapThread(): void {
        const threadInjector = Injector.create({
            providers: [{provide: 'injectParams', useValue: this.$params}],
            parent: this.injector,
        });

        this.threadRef = this.componentFactoryResolver
            .resolveComponentFactory(NotificationThreadComponent)
            .create(threadInjector);

        this.appRef.attachView(this.threadRef.hostView);
        this.document.body.appendChild(this.threadRef.location.nativeElement);
    }

    private subscribeOnEvents(): void {
        const Events = NotificationEvents;

        this.eventService.subscribe(
            {name: Events.PushComponent},
            (params: IPushComponentParams) => {this.pushComponent(params);},
        );

        this.eventService.subscribe(
            {name: Events.PushMessage},
            (params: IPushMessageParams) => {this.pushMessage(params);},
        );

        this.eventService.subscribe(
            {name: Events.Dismiss},
            (id: number) => {this.dismiss(id);},
        );
    }

    /**
     * @description
     *
     * Changes number of display items on min-width events
     */
    private subscribeOnMedia(): void {
        // TODO switch to deviceMode;
        const breakpoints: {minWidth: number, items: number}[] = [];
        _each(this.$params.notificationsPerBreakpoint, (items, breakpoint) => {
            breakpoints.push({
                minWidth: +breakpoint,
                items,
            });
        });

        _each(breakpoints, ({minWidth, items}, index) => {
            const mq = window.matchMedia(`screen and (min-width: ${minWidth}px)`);

            if (mq.matches) {
                this.displayItems = items;
            }

            GlobalHelper.mediaQueryObserver(mq).subscribe((event: MediaQueryListEvent) => {
                if (event.matches) {
                    this.displayItems = items;
                } else {
                    this.displayItems = breakpoints[index - 1].items;
                }
                this.refresh();
            });

        });

        this.refresh();
    }

    /**
     * @description
     *
     * Pushes standard message that supports next features:
     *
     * - Message title and description
     * - Message types with different representation (info/success/warning/error)
     * - Action - button with given text and click handler
     * - Icon or image
     *
     * @param params object with message data and notification options
     */
    private pushMessage({dismissTime, ...componentParams}: IPushMessageParams): void {
        this.pushComponent({
            Component: MessageComponent,
            componentParams,
            dismissTime,
        });
    }

    /**
     * @description
     *
     * Pushes any given component into notification thread
     */
    private pushComponent(params: IPushComponentParams): void {
        const newNotification = this.createNotification(params);

        this.actions$.next([
            {
                getNextState: (notifications) => [...notifications, newNotification],
            },
            {
                waiter: this.threadRef.instance.threadItemList.changes,
                getNextState: (notifications, list: QueryList<ElementRef<HTMLLIElement>>) => {
                    const height = list.last.nativeElement.offsetHeight;
                    _last(notifications).height = height;

                    return _map(notifications, (notification) => {
                        return _assign(notification, {
                            threadAnimationState: 'shift',
                            threadAnimationValue: this.$params.theme === 'bottom'
                                ? `-${height}px`
                                : `${height}px`,
                        });
                    });
                },
            },
            {
                waiter: timer(SHIFT_ANIMATION_DURATION),
                getNextState: (notifications) => {
                    return _map(notifications, (notification) => {
                        return _assign(notification, {
                            threadAnimationState: null,
                            threadAnimationValue: null,
                            collision: true,
                        });
                    });
                },
            },
        ]);
    }

    /**
     * @description
     *
     * Removes notification from thread
     *
     * @param targetId ID of notification that should be dismissed
     */
    private dismiss(targetId: number): void {
        const target = _find(this.notifications, {id: targetId});
        if (!target) {
            this.logService.sendLog({
                code: '0.6.0',
                data: {notificationId: targetId},
            });
            return;
        }
        target.dismissTimer.unsubscribe();

        this.actions$.next([
            {
                getNextState: (notifications) => {
                    return _map(notifications, (notification) => {
                        if (notification.id === targetId) {
                            return _assign(notification, {threadAnimationState: 'dismiss'});
                        }

                        return notification;
                    });
                },
            },
            {
                waiter: timer(DISMISS_ANIMATION_DURATION),
                displayItems: target.hide ? this.displayItems : this.displayItems + 1,
                getNextState: (notifications) => {
                    const targetIndex = _findIndex(notifications, {id: targetId});
                    const targetHeight = notifications[targetIndex].height;

                    return _map(notifications, (notification, index) => {
                        if (index < targetIndex) {
                            return _assign(notification, {
                                threadAnimationState: 'shift',
                                threadAnimationValue: this.$params.theme === 'bottom'
                                    ? `${targetHeight}px`
                                    : `-${targetHeight}px`,
                            });
                        }

                        return notification;
                    });
                },
            },
            {
                waiter: timer(SHIFT_ANIMATION_DURATION),
                getNextState: (notifications) => {
                    return _reduce<INotification, INotification[]>(notifications, (newNotifications, notification) => {
                        if (notification.id === targetId) {
                            return newNotifications;
                        }

                        return _concat(newNotifications, _assign(
                            notification,
                            {
                                threadAnimationState: null,
                                threadAnimationValue: null,
                            },
                        ));
                    }, []);
                },
            },
        ]);
    }

    private refresh(): void {
        this.actions$.next([{
            getNextState: (notifications) => notifications,
        }]);
    }

    private createNotification(pushParams: IPushComponentParams): INotification {
        const id = this.notificationsCount++;
        const metadata: INotificationMetadata = {
            dismiss: (from: string = 'notification') => {
                this.eventService.emit({
                    name: NotificationEvents.Dismiss,
                    data: id,
                    from,
                });
            },
        };

        const {
            Component,
            componentParams = null,
            dismissTime = this.$params.defaultDismissTime,
        } = pushParams;

        const notification: INotification = {
            id,
            Component,
            threadAnimationState: null,
            threadAnimationValue: null,
            collision: false,
            hide: false,
            injector: this.createNotificationInjector(
                componentParams,
                metadata,
            ),
            dismissTime,
            dismissTimer: this.createDismissTimer(id, dismissTime),
        };

        return notification;
    }

    private createDismissTimer(id: number, dismissTime: number): Subscription {
        return timer(dismissTime).subscribe(() => {
            this.eventService.emit({
                name: NotificationEvents.Dismiss,
                data: id,
                from: 'notificationService',
            });
        });
    }

    /**
     *  @param notificationParams params that would be provided in notification as 'injectParams'
     *  @param metadata object that contains notification functionality
     *  @returns {Object} injector that provides given params and metadata
     */
    private createNotificationInjector(
        notificationParams: unknown,
        metadata: INotificationMetadata,
    ): Injector {
        return Injector.create({
            providers: [
                {provide: 'injectParams', useValue: notificationParams},
                {provide: NOTIFICATION_METADATA, useValue: metadata},
            ],
            parent: this.injector,
        });
    }
}
