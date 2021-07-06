import {Injectable, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
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

import {
    ConfigService,
    EventService,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {PIQCashierComponent} from 'wlc-engine/modules/finances/components/piq-cashier/piq-cashier.component';
import {
    PIQCashierConvertedMethod,
    IPIQCashierTheme,
} from 'wlc-engine/modules/finances/system/interfaces';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {UserService} from 'wlc-engine/modules/user';

export enum PIQCashierServiceEvents {
    loadSuccess = 'PIQ_CASHIER_LOAD_SUCCESS',
    closed = 'PIQ_CASHIER_CLOSED',
}

interface IFrameMessage {
    message: string;
    error?: string;
}

@Injectable({
    providedIn: 'root',
})
export class PIQCashierService {

    protected modalClosed$: Subject<void>;

    protected method: PIQCashierConvertedMethod;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected userService: UserService,
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
        method: PIQCashierConvertedMethod,
        currentSystem: PaymentSystem,
        amount: number,
    ): Promise<void> {
        return new Promise(async (resolve) => {
            await import('paymentiq-cashier-bootstrapper');
            this.modalClosed$ = this.getModalClosedSubject();
            this.method = method;
            this.modalService.showModal({
                id: 'piq-cashier',
                modalTitle: method === 'deposit' ? gettext('Deposit') : gettext('Withdraw'),
                component: PIQCashierComponent,
                onModalShown: () => {
                    this.loadPIQCashier(currentSystem, amount);
                },
                onModalHide: () => {
                    window._PaymentIQCashierReset();
                },
                onModalHidden: () => {
                    this.eventService.emit({
                        name: PIQCashierServiceEvents.closed,
                        from: 'piq-cashier',
                    });
                    this.modalClosed$.next();
                    this.modalClosed$.complete();
                    this.modalClosed$ = null;
                    resolve();
                },
                size: 'lg',
                dismissAll: true,
                backdrop: 'static',
            });
        });
    }

    protected async loadPIQCashier(currentSystem: PaymentSystem, amount: number): Promise<void> {
        const cashierThemeSource = window.getComputedStyle(this.document.querySelector('.modal-dialog'));
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

        const idUser = await this.userService.userInfo$.pipe(first((v) => !!v)).toPromise()
            .then((userInfo) => userInfo.idUser);

        const cashierConfig: IPiqCashierConfig = {
            environment: this.configService.get<string>('appConfig.env') === 'prod' ? 'production' : 'test',
            method: this.method,
            merchantId: currentSystem.customParams?.merchant_id,
            providerType: currentSystem.customParams?.provider || null,
            amount: amount || null,
            sessionId: `${idUser}-${DateTime.local().toMillis()}`,
            userId: idUser,
            showHeader: !currentSystem.customParams?.provider,
            showFooter: !currentSystem.customParams?.provider,
            theme: cashierTheme,
            blockBrowserNavigation: true,
        };

        this.subscribeToIFrameMessages();

        try {
            new window._PaymentIQCashier('#wlc-piq-cashier', cashierConfig,
                (api: any) => {
                    api.on({
                        cashierInitLoad: () => {
                            window.parent.postMessage({message: 'PIQ_LOAD_SUCCESS'}, `${window.origin}`);
                        },
                        onLoadError: (data: any) => {
                            window.parent.postMessage(
                                {
                                    message: 'PIQ_LOAD_ERROR',
                                    error: data.status,
                                },
                                `${window.origin}`,
                            );
                        },
                    });
                    api.set({
                        user: {
                            email: this.userService.userInfo.email,
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
            this.modalService.hideModal('piq-cashier');
            this.showError(error.message);
        }
    }

    private subscribeToIFrameMessages(): void {
        fromEvent(window, 'message').pipe(
            filter((event: MessageEvent) => event.origin === `${window.origin}`),
            map((event: MessageEvent) => event.data),
            takeUntil(this.modalClosed$),
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
        this.modalService.hideModal('piq-cashier');
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
        if (this.modalClosed$) {
            this.modalClosed$.next();
            this.modalClosed$.complete();
        }
        return new Subject();
    }
}
