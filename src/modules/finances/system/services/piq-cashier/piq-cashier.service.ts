import {Injectable, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    BehaviorSubject,
    fromEvent,
    Subject,
} from 'rxjs';
import {
    filter,
    first,
    map,
    takeUntil,
} from 'rxjs/operators';
import {DateTime} from 'luxon';
import {IPiqCashierConfig} from 'paymentiq-cashier-bootstrapper';
import _merge from 'lodash-es/merge';

import {
    ConfigService,
    EventService,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {PIQCashierComponent} from 'wlc-engine/modules/finances/components/piq-cashier/piq-cashier.component';
import {IPIQCashierCParams} from 'wlc-engine/modules/finances/components/piq-cashier/piq-cashier.params';
import {
    TPaymentsMethods,
    IPIQCashierTheme,
    PIQCashierConvertedMethod,
} from 'wlc-engine/modules/finances/system/interfaces';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {WINDOW} from 'wlc-engine/modules/app/system';

export enum PIQCashierServiceEvents {
    loadSuccess = 'PIQ_CASHIER_LOAD_SUCCESS',
    closed = 'PIQ_CASHIER_CLOSED',
}

interface IFrameMessage {
    message: string;
    error?: string;
}

// TODO Delete after updating paymentiq-cashier-bootstrapper package #241360
interface IIPiqCashierConfig extends IPiqCashierConfig {
    attributes: {
        hostUri?: string,
        didToken?: string,
        [key: string]: string | number | boolean;
    };
}

@Injectable({
    providedIn: 'root',
})
export class PIQCashierService {

    public closedIframe$: Subject<void>;
    protected method: PIQCashierConvertedMethod;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected modalService: ModalService,
    ) {}

    /**
     * Open PIQ Cashier modal
     *
     * @param {TPIQCashierMethod} method - payment method type
     * @param {PaymentSystem} currentSystem Current payment system
     * @param {number} amount deposit/withdraw amount
     *
     * @returns {Promise<void>} Promise<void>
     */
    public async openPIQCashier(
        method: TPaymentsMethods,
        currentSystem: PaymentSystem,
        amount: number,
    ): Promise<void> {
        return new Promise((resolve: () => void): void => {
            this.method = PIQCashierConvertedMethod[method];
            this.modalService.showModal<IPIQCashierCParams>({
                id: 'piq-cashier',
                modalTitle: method === 'deposit' ? gettext('Deposit') : gettext('Withdraw'),
                component: PIQCashierComponent,
                onModalShown: () => {
                    this.loadPIQCashier(currentSystem, amount);
                },
                onModalHidden: () => resolve(),
                size: 'lg',
                dismissAll: true,
                backdrop: 'static',
            }, {
                mode: method,
                modal: true,
            });
        });
    }

    /**
     * Load and settings PIQ Cashier
     *
     * @param currentSystem - Current payment system
     * @param amount - value for deposit/withdraw
     * @param method - payment method type
     */
    public async loadPIQCashier(
        currentSystem: PaymentSystem,
        amount: number,
        method?: TPaymentsMethods): Promise<void> {
        await import('paymentiq-cashier-bootstrapper');

        const cashierThemeSource = this.window.getComputedStyle(
            this.document.querySelector('.modal-dialog') ||
            this.document.querySelector('.wlc-sections__profile-content'),
        );
        const cashierTheme: IPIQCashierTheme = {
            background: {
                color: cashierThemeSource.backgroundColor,
            },
            cashierbackground: {
                color: cashierThemeSource.backgroundColor,
            },
            labels: {
                color: cashierThemeSource.color,
                fontSize: cashierThemeSource.fontSize,
            },
            headings: {
                color: cashierThemeSource.color,
                fontSize: cashierThemeSource.fontSize,
            },
            input: {
                color: cashierThemeSource.color,
                fontSize: cashierThemeSource.fontSize,
            },
        };

        this.method = PIQCashierConvertedMethod[method] || this.method;
        this.closedIframe$ = this.getModalClosedSubject();

        const {idUser, userEmail} = await this.configService
            .get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(first((v) => !!v))
            .toPromise()
            .then((userInfo) => {
                return {
                    idUser: userInfo.idUser,
                    userEmail: userInfo.email,
                };
            });

        const cashierConfig: IIPiqCashierConfig = {
            environment: this.configService.get<string>('appConfig.env') === 'prod' ? 'production' : 'test',
            method: this.method,
            merchantId: currentSystem.customParams?.merchant_id,
            providerType: currentSystem.customParams?.provider || null,
            amount: amount || null,
            sessionId: `${idUser}-${DateTime.local().toMillis()}`,
            userId: idUser,
            showHeader: !currentSystem.customParams?.provider,
            showFooter: !currentSystem.customParams?.provider,
            theme: _merge(cashierTheme, this.configService.get<IPIQCashierTheme>('$base.finances.piqCashier.theme')),
            blockBrowserNavigation: this.configService.get<boolean>('$base.finances.piqCashier.blockBrowserNavigation'),
            fetchConfig: this.configService.get<boolean>('$base.finances.piqCashier.fetchConfig'),
            attributes: {
                paySystem: currentSystem.id,
            },
        };

        this.subscribeToIFrameMessages();

        try {
            new this.window._PaymentIQCashier('#wlc-piq-cashier', cashierConfig,
                (api: any) => {
                    api.on({
                        cashierInitLoad: () => {
                            this.window.parent.postMessage({message: 'PIQ_LOAD_SUCCESS'}, `${this.window.origin}`);
                        },
                        onLoadError: (data: any) => {
                            this.window.parent.postMessage(
                                {
                                    message: 'PIQ_LOAD_ERROR',
                                    error: data.status,
                                },
                                `${this.window.origin}`,
                            );
                        },
                    });
                    api.set({
                        user: {
                            email: userEmail,
                        },
                        config: {
                            bonusCode: currentSystem.additionalParams.bonusId ?? null,
                        },
                    });
                    api.css(`
                    .container {
                        width: 100%;
                    }
                    `);
                });
        } catch (error) {
            if (this.modalService.getActiveModal('piq-cashier')) {
                this.modalService.hideModal('piq-cashier');
            }
            this.showError(error.message);
        }
    }

    private subscribeToIFrameMessages(): void {
        fromEvent(this.window, 'message').pipe(
            filter((event: MessageEvent) => event.origin === `${this.window.origin}`),
            map((event: MessageEvent) => event.data),
            takeUntil(this.closedIframe$),
        ).subscribe((data: IFrameMessage) => {
            switch (data.message) {
                case 'PIQ_LOAD_SUCCESS':
                    this.onLoadSuccess();
                    break;
                case 'PIQ_LOAD_ERROR':
                    this.onLoadError(data.error);
                    break;
            }
        });
    }

    private onLoadSuccess(): void {
        this.eventService.emit({
            name: PIQCashierServiceEvents.loadSuccess,
            from: 'piq-cashier',
        });
    }

    private onLoadError(error?: string): void {
        if (this.modalService.getActiveModal('piq-cashier')) {
            this.modalService.hideModal('piq-cashier');
        }
        this.showError(error);
    }

    private showError(error?: string) {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'error',
                title: this.method === 'deposit' ? gettext('Deposit error') : gettext('Withdraw error'),
                message: [
                    gettext('Something went wrong. Please try again later.'),
                    error ? error : '',
                ],
            },
        });
    }

    private getModalClosedSubject(): Subject<void> {
        if (this.closedIframe$) {
            this.closedIframe$.next();
            this.closedIframe$.complete();
        }
        return new Subject();
    }
}
