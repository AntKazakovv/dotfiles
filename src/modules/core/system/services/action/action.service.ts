import {
    Injectable,
    Injector,
    Renderer2,
    RendererFactory2,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

import {
    StateService,
    UIRouter,
} from '@uirouter/core';

import {
    BehaviorSubject,
    Subject,
    fromEvent,
    Observable,
} from 'rxjs';
import {
    filter,
    first,
    takeWhile,
} from 'rxjs/operators';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {DeviceType} from 'wlc-engine/modules/core/system/models/device.model';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {DeviceModel} from 'wlc-engine/modules/core/system/models/device.model';
import {DeviceOrientation} from 'wlc-engine/modules/core/system/models/device.model';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {AppType} from 'wlc-engine/modules/core/system/interfaces/base-config/app.interface';
import {IRedirect} from 'wlc-engine/modules/core/system/interfaces/core.interface';

import {
    UserService,
    UserProfile,
} from 'wlc-engine/modules/user';

import _isString from 'lodash-es/isString';
import _toNumber from 'lodash-es/toNumber';
import _forEach from 'lodash-es/forEach';

export type ScrollPositionType = 'start' | 'end';

export interface IScrollOptions {
    position: ScrollPositionType;
    offsetY?: number;
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
        private translateService: TranslateService,
        private rendererFactory: RendererFactory2,
        private router: UIRouter,
        private stateService: StateService,
        @Inject(DOCUMENT) protected document: HTMLDocument,
    ) {
        this.init();
    }

    public lockBody(): void {
        if (window.pageYOffset) {
            this.scrollTop = window.pageYOffset;
        }

        const elems = [this.document.documentElement, this.document.body];
        _forEach(elems, (elem) => {
            this.renderer.setStyle(elem, 'height', '100%');
            this.renderer.setStyle(elem, 'overflow', 'hidden');
        });
    }

    public unlockBody(): void {
        const elems = [this.document.documentElement, this.document.body];
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
            case 'GET_CONFIG':
                if (initialPath.token === 'kjdnfhjgernghiwnin39u548dfkjnvk') {
                    const a = this.document.createElement('a');
                    const config = await this.layoutService
                        .generateFullConfigWithLayouts(initialPath.slim !== 'true');
                    delete config.$user?.userProfile$;
                    var file = new Blob([JSON.stringify(config)], {type: 'application/json'});
                    a.href = URL.createObjectURL(file);
                    a.download = initialPath.configname || 'config.json';
                    a.click();
                }
                break;
            case 'PAYMENT_SUCCESS': {
                await this.configService.ready;
                const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>(
                    {name: '$user.userProfile$'},
                );

                userProfile$.pipe(filter((profile) => !!profile), first()).subscribe((profile) => {

                    this.eventService.emit({
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'success',
                            title: gettext('Payment success'),
                            displayAsHTML: true,
                            wlcElement: 'notification_deposit-success',
                            message: [
                                this.translateService.instant(gettext('Deposit completed successfully')),
                                `<span wlc-currency [value]="${initialPath.amount}" [currency]="'${profile.currency}'"></span> ` +
                                this.translateService.instant(gettext('were successfully deposited in your account.')),
                            ],
                        },
                    });
                });
                break;
            }
            case 'PAYMENT_FAIL':
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Payment failed'),
                        message: [
                            gettext('Unfortunately your payment didn\'t go through.'
                                + ' An e-mail with detailed information has been sent to your e-mail address.'
                                + ' If you have any questions, please don\'t hesitate to contact us.'),
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
                element = this.document.querySelector(elem);
            } else {
                element = elem;
            }

            if (options?.offsetY) {
                element.style.paddingBottom = this.getStyleNumValue(element, 'paddingBottom') + options.offsetY + 'px';
            }

            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: options?.position || 'start',
                });

                if (options?.offsetY) {
                    element.style.paddingBottom = this.getStyleNumValue(element, 'paddingBottom') - options.offsetY + 'px';
                }
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

    /**
     * get device type
     * @returns {DeviceType} - device type
     */
    public getDeviceType(): DeviceType {
        if (this.breakpoints.desktop.mq.matches) {
            return DeviceType.Desktop;
        } else if (this.breakpoints.tablet.mq.matches) {
            return DeviceType.Tablet;
        } else {
            return DeviceType.Mobile;
        }
    }

    private getStyleNumValue(elem: HTMLElement, style: string): number {
        return _toNumber(globalThis.getComputedStyle(elem)[style].replace(/[^\d\.\-]/g, ''));
    }

    private async init(): Promise<void> {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.configService.ready.then(() => {
            this.device = this.configService.get<DeviceModel>('device');
            fromEvent(window, 'resize').subscribe({
                next: (event: Event) => {
                    this.windowResizeSubject.next({
                        device: this.device,
                        event,
                    });
                },
            });
        });

        this.runAffiliatesListener();

        await this.createBreakpoints();
        this.deviceTypeSubject.next(this.getDeviceType());
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
        await this.layoutService.importModules(['user']);
        const userService: UserService = this.injector.get(UserService);

        try {
            this.modalService.showModal('registration-success');
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
            this.modalService.hideModal('registration-success');
            const redirect: IRedirect = this.configService.get<IRedirect>('$base.redirects.registration');
            if (redirect) {
                this.stateService.go(redirect.state, redirect?.params || {});
            }
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

    private get lang(): string {
        return this.configService.get<string>('currentLanguage') || 'en';
    }

    private async runAffiliatesListener(): Promise<void> {
        await this.configService.ready;

        if (this.configService.get<AppType>('$base.app.type') === 'wlc') {
            return;
        }

        const address = this.configService.get<string>('$base.affiliate.siteUrl');

        this.router.transitionService.onBefore({}, (trans) => {
            const url = trans.to().url.split(':');
            const params = trans.params('to');
            if (!trans.paramsChanged()['locale'] && trans.to().name !== 'app.home') {
                trans.abort();
                const newUrl = `${params['locale'] || this.lang}${url[0]}${params[url[1]] || ''}`;
                this.document.defaultView.open(address + newUrl, '_self', null, true);
            }
        });

        const current = this.router.globals.transition.to();

        if (current.name !== 'app.home') {
            const locale = current.params?.['locale'] || this.lang;
            this.document.defaultView.open(`${address}${locale}/error`);
        }

        const affAddress = this.configService.get<string>('$base.affiliate.affiliateUrl');

        this.eventService.subscribe({
            name: 'AFFILIATE_LOGIN',
        }, () => {
            this.document.defaultView.open(affAddress + this.lang, '_self');
        });

        this.eventService.subscribe({
            name: 'AFFILIATE_SIGNIN',
        }, () => {
            this.document.defaultView.open(affAddress + this.lang + '/Register', '_self');
        });
    }
}
