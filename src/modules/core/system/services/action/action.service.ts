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
    TransitionService,
    UIRouter,
} from '@uirouter/core';

import {
    BehaviorSubject,
    Subject,
    fromEvent,
    Observable,
    Subscription,
} from 'rxjs';
import {
    distinctUntilChanged,
    first,
    map,
    takeWhile,
    filter,
} from 'rxjs/operators';
import _isString from 'lodash-es/isString';
import _toNumber from 'lodash-es/toNumber';
import _forEach from 'lodash-es/forEach';
import _assign from 'lodash-es/assign';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
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
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {
    Bonus,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {
    DataService,
    IData,
} from 'wlc-engine/modules/core/system/services/data/data.service';

export type ScrollPositionType = 'start' | 'end' | 'center' | 'nearest';

type TPaymentStatus = 'PAYMENT_SUCCESS' | 'PAYMENT_PENDING';
type TPaymentStatusAll = TPaymentStatus | 'PAYMENT_FAIL';
type TUserDepositCountsInfo = Pick<UserInfo, 'depositsCount'>;

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

export interface IPaymentPostMessage {
    eventType: TPaymentStatusAll;
    eventData: {
        amount: string;
        transactionId: string;
        type?: string;
    }
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
    private depositInIframe: boolean = false;
    private emitDepositStatus$: Subscription;
    private scrollableElements$: IIndexing<Observable<number>> = {};

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
        private cachingService: CachingService,
        private injectionService: InjectionService,
        private transition: TransitionService,
        private logService: LogService,
        private dataService: DataService,
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
            case 'PAYMENT_SUCCESS': {
                this.checkDeposit('PAYMENT_SUCCESS', initialPath);
                break;
            }
            case 'PAYMENT_PENDING':
                this.checkDeposit('PAYMENT_PENDING');
                break;
            case 'PAYMENT_FAIL':
                this.onPaymentFail();
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
                this.onSocialConnect();
                break;
        }

        switch (initialPath.error) {
            case 'SOCIAL_LOGIN_FAILED':
                this.onSocialConnect(true);
                break;
        }

        this.processPromocode(initialPath);
    }

    /**
     * Subscribes bonus with promocode from URL
     *
     * @param {IIndexing<string>} initialPath
     * @returns {Promise<void>}
     */
    public async processPromocode(initialPath: IIndexing<string>): Promise<void> {
        const bonusesService: BonusesService = await this.injectionService
            .getService<BonusesService>('bonuses.bonuses-service');
        const promocodeCacheKey: string = bonusesService.dbPromoUrl;

        await this.configService.ready;

        if (initialPath.promocode) {
            await this.cachingService.set<string>(
                promocodeCacheKey,
                initialPath.promocode,
                true,
                7 * 24 * 60 * 60 * 1000, // 7 days
            );
        }
        try {
            await bonusesService.checkPromoBonus();

            if (await this.cachingService.get(promocodeCacheKey)) {
                if (bonusesService.promoBonus) {
                    if (this.configService.get<boolean>('$user.isAuthenticated')) {
                        const bonus: Bonus = await bonusesService.subscribeBonus(bonusesService.promoBonus, false);
                        if (bonus) {

                            switch (bonus.event) {
                                case 'sign up':
                                case 'registration':
                                case 'verification':
                                    this.modalService.showModal('promoSuccess', {
                                        title: gettext('Bonus success'),
                                        status: 'fromLink',
                                        texts: {
                                            fromLink: this.translateService.instant(
                                                gettext('Congratulations! You activated bonus'))
                                                    + ` ${bonus.name}! `
                                                    + this.translateService.instant(
                                                        gettext('Bonus successfully added to the Bonuses page.')),
                                        },
                                    });
                                    break;
                                default:
                                    this.modalService.showModal('promoSuccess', {
                                        title: gettext('Bonus success'),
                                        status: 'fromLink',
                                        texts: {
                                            fromLink: this.translateService.instant(
                                                gettext('Congratulations! You have got bonus'))
                                                    + ` ${bonus.name}! `
                                                    + this.translateService.instant(
                                                        gettext('Bonus successfully added to the Bonuses page.')),
                                        },
                                    });
                                    break;
                            }
                            this.cachingService.clear(promocodeCacheKey);
                        }
                    } else {
                        const subscription: Subscription = this.eventService.subscribe([
                            {name: 'LOGIN'},
                        ], (): void => {
                            this.processPromocode(initialPath).then((): void => {
                                subscription.unsubscribe();
                            });
                        });
                        if (!this.modalService.getActiveModal('signup')) {
                            this.modalService.showModal('login');
                        }
                    }
                } else {
                    this.eventService.emit({
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'error',
                            title: gettext('Promocode error'),
                            message: gettext('No voucher found'),
                            wlcElement: 'notification_promocode-error',
                        },
                    });
                    this.cachingService.clear(promocodeCacheKey);
                }
            }
        } catch (error) {
            this.showErrorNotification(
                error.errors || error,
                gettext('Promocode error'),
            );
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

    private async checkDeposit(type: TPaymentStatus, initialPath?: IIndexing<string>): Promise<void> {
        await this.configService.ready;

        if (this.depositInIframe && GlobalHelper.isIframe(this.window)) {

            const postMessage: Partial<IPaymentPostMessage> = {
                eventType: type,
            };

            if (type === 'PAYMENT_SUCCESS') {
                postMessage.eventData = {
                    amount: initialPath.amount,
                    transactionId: initialPath.tid,
                };
            }

            try {
                this.window.parent?.postMessage(postMessage, '*');
            } catch (error) {
                this.logService.sendLog({code: '17.0.0', data: error});
            }
        } else {
            if (type === 'PAYMENT_SUCCESS') {
                this.onPaymentSuccess(initialPath);
            } else {
                this.onPaymentPending();
            }
        }
    }

    private onPaymentFail(): void {
        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>(
            {name: '$user.userProfile$'},
        );
        userProfile$.pipe(first((profile) => !!profile)).subscribe(() => {
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
        });
    }

    private onPaymentPending(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'info',
                title: gettext('Payment pending'),
                message: [
                    gettext('Transaction is in the pending status.'
                        + ' If everything goes as expected, your funds soon will reach the gaming balance.'),
                ],
                wlcElement: 'notification_deposit-pending',
            },
        });
    }

    private onPaymentSuccess(initialPath: IIndexing<string>): void {
        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>(
            {name: '$user.userProfile$'},
        );

        userProfile$.pipe(first((profile) => !!profile)).subscribe((profile) => {

            this.configService.get<Deferred<null>>({name: 'firstLanguageReady'})
                .promise
                .then(() => {
                    const type = initialPath.type?.toLowerCase();
                    const message: string[] = [
                        (type === 'withdraw')
                            ? this.translateService.instant(gettext('Withdraw request has been successfully sent!'))
                            : this.translateService.instant(gettext('Deposit completed successfully')),
                    ];

                    if (initialPath.amount) {
                        const currencyElement = `<span wlc-currency [value]="${initialPath.amount}" `
                            + `[currency]="'${profile.currency}'"></span>`;

                        if (type === 'withdraw') {
                            message.push(
                                this.translateService.instant(gettext('Withdraw sum')) + ` ${currencyElement}`,
                            );
                        } else {
                            message.push(
                                `${currencyElement} `
                                + this.translateService.instant(
                                    gettext('were successfully deposited in your account.'),
                                ),
                            );
                        }
                    }

                    const paymentMessage = {
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'success',
                            title: gettext('Payment success'),
                            displayAsHTML: true,
                            wlcElement: 'notification_deposit-success',
                            message,
                        },
                    };

                    if (type === 'withdraw') {
                        _assign(paymentMessage.data,
                            {
                                title: gettext('Withdraw'),
                                wlcElement: 'notification_withdraw-success',
                                message,
                            });
                    } else {
                        if (!this.emitDepositStatus$) {
                            this.emitDepositStatus$ = this.dataService.flow
                                .pipe(
                                    filter(
                                        (data: IData): boolean => {
                                            return data.system === 'user'
                                                && data.code === 200
                                                && data.name === 'userInfo'
                                                && data.data.loyalty.DepositsCount > 0;
                                        }),
                                    map((data: IData): TUserDepositCountsInfo =>
                                        ({depositsCount: Number(data.data.loyalty.DepositsCount)})),
                                    distinctUntilChanged(
                                        (prev: TUserDepositCountsInfo, curr: TUserDepositCountsInfo): boolean => {
                                            return prev.depositsCount === curr.depositsCount;
                                        }))
                                .subscribe((data: TUserDepositCountsInfo): void => {
                                    if (data.depositsCount === 1) {
                                        this.eventService.emit({
                                            name: 'FIRST_DEPOSIT_COMPLETE',
                                            data: {
                                                amount: initialPath.amount,
                                                currency: profile.currency,
                                            },
                                        });
                                    };

                                    this.eventService.emit({
                                        name: 'DEPOSIT_COMPLETE',
                                        data: {
                                            depositsCount: data.depositsCount,
                                            amount: initialPath.amount,
                                            currency: profile.currency,
                                        },
                                    });
                                });
                        }
                    };

                    this.eventService.emit(paymentMessage);
                });
        });
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
                    const message: IPaymentPostMessage = event.data;

                    if (['PAYMENT_SUCCESS', 'PAYMENT_PENDING', 'PAYMENT_FAIL'].includes(message.eventType)) {
                        this.modalService.closeAllModals();

                        if (message.eventType === 'PAYMENT_SUCCESS') {
                            this.onPaymentSuccess(message.eventData);
                        } else if (message.eventType === 'PAYMENT_FAIL') {
                            this.onPaymentFail();
                        }
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
            if (!isFastRegistration) {
                this.logService.sendLog({code: '1.1.29'});
            }
        } catch (error) {
            this.showErrorNotification(error.errors, gettext('Registration error'), 'register');
            if (!isFastRegistration && error.data?.code !== 200) {
                this.logService.sendLog({code: '1.1.30'});
            }
        } finally {
            this.modalService.hideModal('registration-success');
            const redirect = this.configService.get<IRedirect>('$base.redirects.registration');
            if (redirect) {
                this.stateService.go(redirect.state, redirect.params || {});
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
