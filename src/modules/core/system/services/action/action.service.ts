import {
    Injectable,
    Injector,
    Renderer2,
    RendererFactory2,
    Inject,
    NgZone,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {
    StateService,
    TransitionService,
    UIRouter,
    UIRouterGlobals,
    StateParams,
} from '@uirouter/core';

import {
    BehaviorSubject,
    Subject,
    fromEvent,
    Observable,
} from 'rxjs';
import {
    map,
    takeWhile,
} from 'rxjs/operators';
import _isString from 'lodash-es/isString';
import _toNumber from 'lodash-es/toNumber';
import _forEach from 'lodash-es/forEach';
import _assign from 'lodash-es/assign';
import _isEmpty from 'lodash-es/isEmpty';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {DeviceType} from 'wlc-engine/modules/core/system/models/device.model';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {DeviceModel} from 'wlc-engine/modules/core/system/models/device.model';
import {DeviceOrientation} from 'wlc-engine/modules/core/system/models/device.model';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {AppType} from 'wlc-engine/modules/core/system/interfaces/base-config/app.interface';
import {IRedirect} from 'wlc-engine/modules/core/system/interfaces/core.interface';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {ColorThemeService} from 'wlc-engine/modules/core/system/services/color-theme/color-theme.service';
import {
    FinancesService,
    IPaymentPostMessage,
} from 'wlc-engine/modules/finances';
import {
    UserService,
    IEmailVerifyData,
} from 'wlc-engine/modules/user';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {BonusesService} from 'wlc-engine/modules/bonuses';
import {
    DataService,
    IData,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {
    IPopupModalConfig,
    IPopupModalItem,
} from 'wlc-engine/modules/core/system/interfaces/base-config/popup.interface';

export type ScrollPositionType = 'start' | 'end' | 'center' | 'nearest';

export interface IScrollOptions {
    position: ScrollPositionType;
    offsetY?: number;
    inline?: ScrollPositionType;
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

export interface IStateObject {
    lastState: string,
    lastStateParams: StateParams
}

@Injectable({
    providedIn: 'root',
})
export class ActionService {

    public device: DeviceModel;

    protected financesService: FinancesService;

    private deviceTypeSubject: BehaviorSubject<DeviceType> = new BehaviorSubject(null);
    private windowResizeSubject: Subject<IResizeEvent> = new Subject();
    private breakpoints: IDeviceBreakpoints;
    private renderer: Renderer2;
    private scrollTop: number;
    private depositInIframe: boolean = false;
    private scrollableElements$: IIndexing<Observable<number>> = {};

    constructor(
        private injector: Injector,
        private bonusesService: BonusesService,
        private configService: ConfigService,
        private eventService: EventService,
        private layoutService: LayoutService,
        private modalService: ModalService,
        private translateService: TranslateService,
        private rendererFactory: RendererFactory2,
        private router: UIRouter,
        private uiRouter: UIRouterGlobals,
        private stateService: StateService,
        private cachingService: CachingService,
        private injectionService: InjectionService,
        private transition: TransitionService,
        private logService: LogService,
        private dataService: DataService,
        private ngZone: NgZone,
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
        this.init();
    }

    /**
     * Locks the body
     */
    public lockBody(): void {
        if (this.window.pageYOffset) {
            this.scrollTop = this.window.pageYOffset;
        }

        const elems = [this.document.documentElement, this.document.body];
        _forEach(elems, (elem) => {
            this.renderer.setStyle(elem, 'height', '100%');
            this.renderer.setStyle(elem, 'overflow', 'hidden');
        });
    }

    /**
     * Unlocks the body
     */
    public unlockBody(): void {
        const elems = [this.document.documentElement, this.document.body];
        _forEach(elems, (elem) => {
            this.renderer.setStyle(elem, 'height', '');
            this.renderer.setStyle(elem, 'overflow', '');
        });

        if (this.scrollTop) {
            this.window.scrollTo(0, this.scrollTop);
        }
    }

    /**
     * Save scroll observable for current element
     *
     * @param element Element
     * @param name Identificator for element
     */
    public setScrollableElement(element: Element, name: string): void {
        this.scrollableElements$[name] = fromEvent(element, 'scroll').pipe(map(() => element.scrollTop));
    }

    /**
     * Get scroll observable of element
     *
     * @param name Identificator of saved element
     */
    public scrollableElement(name: string): undefined | Observable<number> {
        return this.scrollableElements$[name];
    }

    /**
     * Shows process messages
     *
     * @param {IIndexing<string>} initialPath
     *
     * @returns {Promise<void>}
     */
    public async processMessages(initialPath: IIndexing<string>): Promise<void> {
        switch (initialPath.message) {
            case 'GET_CONFIG':
                if (initialPath.token === 'kjdnfhjgernghiwnin39u548dfkjnvk') {
                    const config = await this.layoutService
                        .generateFullConfigWithLayouts(initialPath.slim !== 'true');

                    const stringify = (obj: unknown, window: Window) => {
                        const stack = new WeakSet();
                        const replacer = function (this: unknown, key: string, value: unknown): unknown {
                            try {
                                if (value && typeof value === 'object') {
                                    if (stack.has(value)) {
                                        return '[Circular]';
                                    }
                                    stack.add(value);
                                }
                            } catch (error) {
                                return '[Error]';
                            }
                            return value === window ? '[WINDOW]' : value;
                        };
                        return JSON.stringify(obj, replacer);
                    };
                    const file = new Blob([stringify(config, this.window)], {type: 'application/json'});
                    const a = this.document.createElement('a');
                    a.href = URL.createObjectURL(file);
                    a.download = initialPath.configname || 'config.json';
                    a.click();
                }
                break;
            case 'PAYMENT_SUCCESS':
            case 'PAYMENT_PENDING':
            case 'PAYMENT_FAIL':
                const paymentMessage: IPaymentPostMessage = {message: initialPath.message};

                if (initialPath.amount) {
                    paymentMessage.amount = initialPath.amount;
                }

                if (initialPath.tid) {
                    paymentMessage.tid = initialPath.tid;
                }

                this.checkPaymentMessage(paymentMessage);
                break;
            case 'SET_NEW_PASSWORD':
                this.setNewPassword(initialPath);
                break;
            case 'COMPLETE_REGISTRATION':
                this.completeRegistration(initialPath);
                break;
            case 'EMAIL_UNSUBSCRIBE':
                this.onEmailUnsubscribe();
                break;
            case 'FINALIZE_SOCIAL_CONNECT':
                this.onSocialConnect();
                break;
            case 'CONFIRMATION_EMAIL':
                this.mailConfirmation(initialPath);
                break;
        }

        switch (initialPath.error) {
            case 'SOCIAL_LOGIN_FAILED':
                this.onSocialConnect(true);
                break;
        }

        if (initialPath.promocode) {
            this.bonusesService.processPromocode(initialPath.promocode);
        }

        this.openPopup(initialPath);
    }

    /**
     * Open popup modal from query parameters
     *
     * @param {IIndexing<string>} initialPath
     * @returns {Promise<void>}
     */
    public async openPopup(initialPath: IIndexing<string>): Promise<void> {
        if (!initialPath.popup) {
            return;
        }
        await this.configService.ready;
        const usePopup = this.configService.get<boolean>('$base.popupByQuery.use');
        if (usePopup) {
            const modalConfig = this.configService.get<IPopupModalConfig>('$base.popupByQuery.modals');
            const modalParams: IPopupModalItem = modalConfig[initialPath.popup];
            const isAuth = this.configService.get('$user.isAuthenticated');
            if (modalParams?.auth !== !isAuth) {
                this.modalService.showModal(modalParams?.config);
            }
        }
    }

    /**
     * Scrolls to the element
     *
     * @param {string | HTMLElement} name of the element
     * @param {IScrollOptions} scroll options
     */
    public scrollTo(elem?: string | HTMLElement, options?: IScrollOptions): void {
        setTimeout((): void => {
            if (!elem) {
                this.window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
                return;
            }

            const element: HTMLElement = _isString(elem) ? this.document.querySelector(elem) : elem;

            if (options?.offsetY) {
                element.style.paddingBottom = this.getStyleNumValue(element, 'paddingBottom') + options.offsetY + 'px';
            }

            setTimeout((): void => {
                this.setScrollingOffset(element);

                element.scrollIntoView({
                    behavior: 'smooth',
                    block: options?.position || 'start',
                    inline: options?.inline || 'nearest',
                });

                if (options?.offsetY) {
                    element.style.paddingBottom =
                        this.getStyleNumValue(element, 'paddingBottom') - options.offsetY + 'px';
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

    /**
     * Subscribe to the change of device type
     *
     * @returns {Observable<DeviceType>}
     */
    public deviceType(): Observable<DeviceType> {
        return this.deviceTypeSubject.asObservable();
    }

    /**
     * Subscribe to the change of width or height of the window
     *
     *@returns {Observable<IResizeEvent>}
     */
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

    public async injectFinancesService() {
        if (!this.financesService) {
            this.financesService = await this.injectionService.getService('finances.finances-service');
        }
    }

    protected onEmailUnsubscribe() {
        this.emailUnsubscribe().then(() => {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Unsubscribe complete'),
                    message: [
                        gettext('You have been successfully unsubscribed from receiving email notifications'),
                    ],
                },
            });
        }, (error) => {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Unsubscribe not completed'),
                    message: [
                        gettext('Error occured during unsibscribe'),
                    ],
                },
            });
            this.logService.sendLog({
                code: '24.0.0', data: error,
            });
        });
    }

    protected async emailUnsubscribe(): Promise<void> {
        try {
            await this.dataService.request<IData>({
                name: 'emailUnsubscribe',
                url: '/profiles',
                system: 'user',
                type: 'PATCH',
            }, {
                extProfile: {
                    dontSendEmail: true,
                    sendEmail: false,
                },
                emailAgree: false,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private async checkPaymentMessage(initialPath: IPaymentPostMessage): Promise<void> {
        await this.configService.ready;
        await this.injectFinancesService();

        if (this.depositInIframe && GlobalHelper.isIframe(this.window)) {

            try {
                this.window.parent?.postMessage(initialPath, '*');
            } catch (error) {
                this.logService.sendLog({code: '17.0.0', data: error});
            }
        } else {
            switch(initialPath.message) {
                case 'PAYMENT_SUCCESS': {
                    this.financesService.onPaymentSuccess(initialPath);
                    break;
                }
                case 'PAYMENT_PENDING':
                    this.financesService.onPaymentPending();
                    break;
                case 'PAYMENT_FAIL':
                    this.financesService.onPaymentFail();
                    break;
            }
        }
    }

    private getStyleNumValue(elem: HTMLElement, style: string): number {
        return _toNumber(this.window.getComputedStyle(elem)[style].replace(/[^\d\.\-]/g, ''));
    }

    private async init(): Promise<void> {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.configService.ready.then(() => {
            this.device = this.configService.get<DeviceModel>('device');
            fromEvent(this.window, 'resize').subscribe({
                next: (event: Event) => {
                    this.windowResizeSubject.next({
                        device: this.device,
                        event,
                    });
                },
            });

            this.ngZone.runOutsideAngular(() => {
                fromEvent(this.window, 'offline').subscribe(()=> {
                    this.ngZone.run(() => {
                        const lastState: string = this.uiRouter.current.name;
                        const lastStateParams: StateParams = _assign({}, this.uiRouter.params);
                        this.configService.set({
                            name: 'lastState',
                            value: {lastState, lastStateParams},
                            storageType: 'sessionStorage',
                        });
                        this.stateService.go('app.offline');
                    });
                });

                fromEvent(this.window, 'online').subscribe(() => {
                    this.ngZone.run(() => {
                        const lastStateObj: IStateObject = this.configService.get({
                            name: 'lastState',
                            storageType: 'sessionStorage',
                        });
                        if (!_isEmpty(lastStateObj)) {
                            const lastState: string = lastStateObj['lastState'];
                            const lastStateParams: StateParams = lastStateObj['lastStateParams'];
                            this.configService.set({
                                name: 'lastState',
                                value: null,
                                storageClear: 'sessionStorage',
                            });
                            this.stateService.go(lastState, lastStateParams);
                        }
                    });
                });
            });

            if (!this.window.navigator.onLine) {
                this.stateService.go('app.offline');
            }
        });

        await this.configService.ready;

        if (this.configService.get<AppType>('$base.app.type') === 'aff') {
            this.runAffiliatesListener();
        }

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
            this.injector.get(ColorThemeService);
        }

        this.createBreakpoints();
        _forEach(this.breakpoints, (item: IBreakpoint) => {
            item.observer
                .pipe(takeWhile(() => !!this.deviceTypeSubject.observers.length))
                .subscribe(() => {
                    this.deviceTypeSubject.next(this.getDeviceType());
                });
        });
        this.deviceTypeSubject.next(this.getDeviceType());
        this.depositInIframe = this.configService.get<boolean>('$base.finances.depositInIframe');

        if (this.depositInIframe) {
            fromEvent(this.window, 'message').subscribe((event: MessageEvent<IPaymentPostMessage>) => {
                if (event.data) {
                    const eventData: IPaymentPostMessage = event.data;

                    if (['PAYMENT_SUCCESS', 'PAYMENT_PENDING', 'PAYMENT_FAIL'].includes(eventData.message)) {
                        this.modalService.closeAllModals();
                        this.checkPaymentMessage(eventData);
                    }
                }
            });
        }

        const landingAdress: string = this.configService.get<string>('$base.site.landingUrl');

        if (landingAdress) {
            this.eventService.subscribe({
                name: 'AFFILIATE_REDIRECT',
            }, (): void => {
                this.window.open(`${landingAdress}/${this.lang}`);
            });
        }
    }

    private createBreakpoints(): void {
        const breakpoints = this.configService.get<IDeviceConfig>('$base.device')?.breakpoints;
        const createMq = (mq: number): IBreakpoint => {
            const mediaQuery = this.window.matchMedia(`(min-width: ${mq}px)`);
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
            this.showErrorNotification(
                gettext('Code missing'),
                gettext('Password recovery error'),
                'password-recovery-code');
            return;
        }

        await this.configService.ready;

        try {
            const userService = await this.injectionService.getService<UserService>('user.user-service');
            await userService.validateRestoreCode(initialPath.code);
        } catch (error) {
            this.showErrorNotification(
                error.errors,
                gettext('Error occurred during password recovery'),
                'password-recovery');

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
        const userService = await this.injectionService.getService<UserService>('user.user-service');
        const isFastRegistration = this.configService.get<number>('appConfig.siteconfig.fastRegistration');
        const useJwtToken = this.configService.get<boolean>('$base.site.useJwtToken');

        try {
            if (!useJwtToken) {
                this.modalService.showModal('registration-success');
            }

            await userService.registrationComplete(initialPath.code);
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Registration success'),
                    message: gettext('You have been successfully registered!'),
                    wlcElement: 'notification_registration-success',
                    dismissTime: 5,
                },
            });

            if (!useJwtToken) {
                this.eventService.emit({name: 'LOGIN'});
            }

            if (!isFastRegistration) {
                this.logService.sendLog({code: '1.1.29'});
            }
        } catch (error) {
            this.showErrorNotification(error.errors, gettext('Registration error'), 'register');
            if (!isFastRegistration && error.data?.code !== 200) {
                this.logService.sendLog({code: '1.1.30'});
            }
        } finally {
            if (useJwtToken) {
                this.modalService.showModal('login');
            } else {
                this.modalService.hideModal('registration-success');
                const redirect = this.configService.get<IRedirect>('$base.redirects.registration');
                if (redirect) {
                    this.stateService.go(redirect.state, redirect.params || {});
                }
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
                displayAsHTML: true,
                wlcElement: id ? `notification_${id}-error` : null,
            },
        });
    }

    private get lang(): string {
        return this.configService.get<string>('currentLanguage') || 'en';
    }

    private async runAffiliatesListener(): Promise<void> {
        const address = this.configService.get<string>('$base.affiliate.siteUrl');

        this.router.transitionService.onBefore({}, (trans) => {
            const url = trans.to().url.split(':');
            const params = trans.params('to');
            if (!trans.paramsChanged()['locale'] && trans.to().name !== 'app.home') {
                trans.abort();
                const newUrl = `${params['locale'] || this.lang}${url[0]}${params[url[1]] || ''}`;
                this.window.open(address + newUrl, '_self', null);
            }
        });

        const current = this.router.globals.transition.to();

        if (current.name !== 'app.home') {
            const locale = current.params?.['locale'] || this.lang;
            this.window.open(`${address}${locale}/error`);
        }

        const affAddress = this.configService.get<string>('$base.affiliate.affiliateUrl');

        this.eventService.subscribe({
            name: 'AFFILIATE_LOGIN',
        }, () => {
            this.window.open(affAddress + this.lang, '_self');
        });

        this.eventService.subscribe({
            name: 'AFFILIATE_SIGNIN',
        }, () => {
            this.window.open(affAddress + this.lang + '/Register', '_self');
        });
    }

    private async onSocialConnect(error?: boolean): Promise<void> {
        if (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Social connect failed'),
                    message: [
                        gettext('Error connect social network, try later.'),
                    ],
                },
            });
        }

        await this.configService.ready;
        const state = this.configService.get<string>({
            name: 'socialState',
            storageType: 'localStorage',
        });
        setTimeout(() => {
            this.stateService.go(state || 'app.home');
            this.configService.set({
                name: 'socialState',
                value: null,
                storageClear: 'localStorage',
            });
        });
    }

    private async mailConfirmation(initialPath: IIndexing<string>): Promise<void> {
        if (!initialPath.code) {
            this.showErrorNotification(
                gettext('Code missing'),
                gettext('Mail verification error'),
                'password-recovery-code');
        }

        await this.configService.ready;

        if (this.configService.get<boolean>('$user.isAuthenticated')) {

            try {
                const userService: UserService =
                    await this.injectionService.getService<UserService>('user.user-service');
                const data: IEmailVerifyData = {code: initialPath.code};
                await userService.emailVerification(data);
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                        title: gettext('Email verification success'),
                        message: gettext('Your email has been successfully verified!'),
                        wlcElement: 'notification_email-verification-success',
                    },
                });
            } catch (error) {
                this.showErrorNotification(
                    error.errors,
                    gettext('Error occurred during email verification'),
                    'password-recovery');

                return;
            }
        } else {
            this.modalService.showModal('password-confirmation', {code: initialPath.code});
        }
    }

    private setScrollingOffset(element: HTMLElement): void {
        if (this.configService.get<boolean>('$base.stickyHeader.use')) {
            const headerElement = this.document.querySelector('.wlc-sections__header') as HTMLElement;

            if (headerElement) {
                const scrollingGap = headerElement.offsetHeight;
                element.style['scrollMarginTop'] = `${scrollingGap}px`;
            }
        }
    }
}
