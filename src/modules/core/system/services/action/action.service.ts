import {
    Injectable,
    Injector,
    Renderer2,
    RendererFactory2,
} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {UIRouter} from '@uirouter/core';
import {
    BehaviorSubject,
    Subject,
    fromEvent,
} from 'rxjs';
import {Observable} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

import {
    ConfigService,
    DeviceType,
    EventService,
    IDeviceConfig,
    IIndexing,
    ModalService,
    LayoutService,
    DeviceModel,
    DeviceOrientation,
    IPushMessageParams,
    NotificationEvents,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {
    forEach as _forEach,
    isString as _isString,
} from 'lodash-es';

export type ScrollPositionType = 'start' | 'end';

export interface IScrollOptions {
    position: ScrollPositionType;
}

export interface IScrollSmoothlyOptions {
    position?: ScrollPositionType;
    time?: number;
}

export interface IBreakpoint {
    mq: MediaQueryList;
    observer: Observable<MediaQueryListEvent>;
}

export interface IDeviceBreakpoints {
    mobile: IBreakpoint;
    tablet: IBreakpoint;
    desktop: IBreakpoint;
}

export interface IResizeEvent {
    device: DeviceModel,
    event: Event;
}

@Injectable({
    providedIn: 'root',
})
export class ActionService {

    public device: DeviceModel;

    private deviceTypeSubject: BehaviorSubject<DeviceType> = new BehaviorSubject(null);
    private windowResizeSubject: Subject<IResizeEvent> = new Subject();
    private breakpoints: IDeviceBreakpoints;
    private renderer: Renderer2;
    private scrollTop: number;

    constructor(
        private injector: Injector,
        private configService: ConfigService,
        private eventService: EventService,
        private layoutService: LayoutService,
        private modalService: ModalService,
        private rendererFactory: RendererFactory2,
        private router: UIRouter,
    ) {
        this.init();
    }

    public lockBody(): void {
        if(window.pageYOffset) {
            this.scrollTop = window.pageYOffset;
        }

        const elems = [document.documentElement, document.body];
        _forEach(elems, (elem) => {
            this.renderer.setStyle(elem, 'height', '100%');
            this.renderer.setStyle(elem, 'overflow', 'hidden');
        });
    }

    public unlockBody(): void {
        const elems = [document.documentElement, document.body];
        _forEach(elems, (elem) => {
            this.renderer.setStyle(elem, 'height', '');
            this.renderer.setStyle(elem, 'overflow', '');
        });

        if (this.scrollTop) {
            window.scrollTo(0, this.scrollTop);
            this.scrollTop = 0;
        }
    }

    public async processMessages(initialPath: IIndexing<string>): Promise<void> {
        switch (initialPath?.message) {
            case 'PAYMENT_SUCCESS':
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                        title: gettext('Payment success'),
                        message: [
                            gettext('Deposit completed successfully'),
                            new CurrencyPipe('en_US', 'EUR').transform(initialPath.amount)
                                + ' ' + gettext('were successfully deposited in your account.'),
                        ],
                        wlcElement: 'notification_deposit-success',
                    },
                });
                break;
            case 'PAYMENT_FAIL':
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Payment failed'),
                        message: [
                            gettext('Unfortunately your payment didn\'t go through.'
                                +' An e-mail with detailed information has been sent to your e-mail address.'
                                +' If you have any questions, please don\'t hesitate to contact us.'),
                        ],
                        wlcElement: 'notification_deposit-error',
                    },
                });
                break;
            case 'SET_NEW_PASSWORD':
                this.setNewPassword(initialPath);
                break;
            case 'COMPLETE_REGISTRATION':
                this.completeRegistration(initialPath);
                break;
            case 'EMAIL_UNSUBSCRIBE':
                //TODO
                break;
            case 'FINALIZE_SOCIAL_CONNECT':
                //TODO
                break;
            // case 'FINALIZE_SOCIAL_REGISTRATION':
            //     UserSocialRegisterService.init();
            //     break;
        }
    }

    public scrollTo(elem?: string | Element, options?: IScrollOptions): void {
        setTimeout(() => {
            elem = elem || 'body';
            let element;
            if (_isString(elem)) {
                element = document.querySelector(elem);
            } else {
                element = elem;
            }

            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: options?.position || 'start',
                });
            }, 100);
        }, 0);
    }

    /**
     * Get device orientation
     *
     * @returns {DeviceOrientation}
     */
    public deviceOrientation(): DeviceOrientation {
        return this.device.orientation;
    }

    public deviceType(): Observable<DeviceType> {
        _forEach(this.breakpoints, (item: IBreakpoint) => {
            item.observer
                .pipe(takeWhile(() => !!this.deviceTypeSubject.observers.length))
                .subscribe(() => this.deviceTypeSubject.next(this.getDeviceType()));
        });
        return this.deviceTypeSubject.asObservable();
    }

    public windowResize(): Observable<IResizeEvent> {
        return this.windowResizeSubject.asObservable();
    }

    private async init(): Promise<void> {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.configService.ready.then(() => {
            this.device = this.configService.get<DeviceModel>('device');
            fromEvent(window, 'resize').subscribe({
                next: (data: Event) => {
                    this.windowResizeSubject.next({
                        device: this.device,
                        event: event,
                    });
                },
            });
        });
        this.router.transitionService.onSuccess({}, () => {
            this.scrollTo();
        });
        await this.createBreakpoints();
        this.deviceTypeSubject.next(this.getDeviceType());
    }

    private getDeviceType(): DeviceType {
        if (this.breakpoints.desktop.mq.matches) {
            return DeviceType.Desktop;
        } else if (this.breakpoints.tablet.mq.matches) {
            return DeviceType.Tablet;
        } else {
            return DeviceType.Mobile;
        }
    }

    private async createBreakpoints(): Promise<void> {
        await this.configService.ready;
        const breakpoints = this.configService.get<IDeviceConfig>('$base.device')?.breakpoints;

        const createMq = (mq: number): IBreakpoint => {
            const mediaQuery = window.matchMedia(`(min-width: ${mq}px)`);
            return {
                mq: mediaQuery,
                observer: GlobalHelper.mediaQueryObserver(mediaQuery),
            };
        };

        this.breakpoints = {
            mobile: createMq(breakpoints?.mobile),
            tablet: createMq(breakpoints?.tablet),
            desktop: createMq(breakpoints?.desktop),
        };
    }

    private async setNewPassword(initialPath: IIndexing<string>): Promise<void> {
        if (!initialPath.code) {
            this.showErrorNotification(gettext('Code missing'), gettext('Password recovery error'), 'password-recovery-code');
            return;
        }

        await this.configService.ready;
        await this.layoutService.importModules(['user']);

        try {
            const userService: UserService = this.injector.get(UserService);
            await userService.validateRestoreCode(initialPath.code);
        } catch (error) {
            this.showErrorNotification(error.errors, gettext('Error occurred during password recovery'), 'password-recovery');

            return;
        }

        this.modalService.showModal('newPassword', {
            wlcElement: 'form_forgot-password',
            common: {
                code: initialPath.code,
            },
        });
    }

    private async completeRegistration(initialPath: IIndexing<string>): Promise<void> {
        if (!initialPath.code) {
            this.showErrorNotification(
                gettext('Code missing'),
                gettext('Registration error'),
                'registrtation-code',
            );
            return;
        }

        await this.configService.ready;
        await this.layoutService.importModules(['games']);
        const userService: UserService = this.injector.get(UserService);

        try {
            this.modalService.showModal('registrationSuccess');
            await userService.registrationComplete(initialPath.code);
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Registration success'),
                    message: gettext('You have been successfully registered!'),
                    wlcElement: 'notification_registration-success',
                },
            });
            this.eventService.emit({name: 'LOGIN'});
        } catch (error) {
            this.showErrorNotification(error.errors, gettext('Registration error'), 'register');
        } finally {
            this.modalService.closeAllModals();
        }
    }

    private showErrorNotification(message: string, title: string, id?: string): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message,
                wlcElement: id ? `notification_${id}-error` : null,
            },
        });
    }
}
