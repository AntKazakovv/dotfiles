import {
    Inject,
    Injectable,
} from '@angular/core';
import {DateTime} from 'luxon';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import * as ethers from 'ethers';

import _isString from 'lodash-es/isString';

import {
    ConfigService,
    EventService,
    IIndexing,
    IPushMessageParams,
    LogService,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {IPaymentMessage} from 'wlc-engine/modules/finances';
import {IAmountFormCParams} from 'wlc-engine/modules/metamask/components/amount-form/amount-form.params';
import {
    metamaskCurrencies,
    metamaskMethods,
    metamaskActionMessages,
} from 'wlc-engine/modules/metamask/system/constants/metamask.constants';
import {
    TMetamaskMsgAction,
    TMetamaskData,
    TMetamaskDataReg,
    IMetamaskDepositData,
} from 'wlc-engine/modules/metamask/system/interfaces/metamask.interfaces';
import {ICurrencyFormCParams} from 'wlc-engine/modules/metamask/components/currency-form/currency-form.params';

/**
 * Service for interaction with MetaMask browser application.
 *
 * DEPOSIT:
 *
 * Available payment systems `PayCryptos Ethereum`, `PayCryptos Ethereum v2`, `PayCryptos USDT` -
 * must have setting `metamask_account` which is filled with smart contract address.
 *
 * AUTHENTICATION:
 *
 * User is registered with MetaMask wallet address as a `login` and predefined `currency`.
 *
 * Required settings:
 *
 * @example
 * `config/backend/0.site.config.php`:
 *  $cfg['useMetamask'] = true;
 */
@Injectable({providedIn: 'root'})
export class MetamaskService {
    /** Defines if MetaMask application is installed */
    public readonly isMetamask: boolean = Boolean(this.window['ethereum']);

    /**
     * An array of a single, hexadecimal Ethereum address string.
     * Updated every time after methods call.
     */
    protected accounts: string [] = [];

    /** Used for define if correct network is used for interaction with wallet. */
    protected isProd: boolean = !this.window.WLC_ENV;

    private isTransactionPending: boolean = false;

    constructor(
        @Inject(WINDOW) protected window: Window,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected logService: LogService,
        protected eventService: EventService,
        protected translate: TranslateService,
    ) {}

    /**
     * Requests MetaMask wallet account addresses.
     * Since array contains single value, method returns first element of array and save original value.
     * @returns {Promise<string>} wallet account address
     */
    public async getAccount(): Promise<string> {
        this.checkMetamask();

        try {
            const accounts: string[] = await this.window.ethereum.request({
                method: metamaskMethods.requestAccounts,
            });
            if (accounts.length) {
                this.accounts = accounts;
                return accounts[0];
            } else {
                throw {errors: gettext('Please connect to MetaMask.')};
            }
        } catch (error) {
            throw this.provideError(error, 'getAccount');
        }
    }

    /**
     * Requests auth data: `walletAddress`, `message`, `signature`.
     * @param {TMetamaskMsgAction} action `'login'`
     * @return {TMetamaskData} `TMetamaskData`
     */
    public async requestAuthData(action: 'login' | 'profile'): Promise<TMetamaskData>;
    /**
     * Requests auth data: `walletAddress`, `message`, `signature`, `currency`.
     * Under the hood, it calls modal window to request profile currency.
     * @param {TMetamaskMsgAction} action `'reg'`
     * @return {TMetamaskDataReg} `TMetamaskDataReg`
     */
    public async requestAuthData(action: 'reg'): Promise<TMetamaskDataReg>;

    public async requestAuthData(action: TMetamaskMsgAction): Promise<TMetamaskData | TMetamaskDataReg> {
        this.checkMetamask();
        await this.getAccount();

        const message: string = this.createMessage(action);
        const signature: string = await this.requestSignature(message);

        if (!signature) {
            throw {errors: gettext('No MetaMask personal signature.')};
        }

        switch (action) {
            case 'login':
            case 'profile':
                return {
                    walletAddress: this.accounts[0],
                    message,
                    signature,
                };
            case 'reg': {
                const currency: string = await this.requestCurrency();
                if (!currency) {
                    throw {errors: gettext('No currency selected.')};
                }

                return {
                    walletAddress: this.accounts[0],
                    message,
                    signature,
                    currency,
                };
            }
        }
    }

    /**
     * Emits deposit via MetaMask.
     * Under the hood, it calls modal window to request transaction amount.
     * @param {IPaymentSystemMessage} paymentMessage payment message for crypto
     */
    public async transaction(paymentMessage: IPaymentMessage): Promise<void> {
        this.checkMetamask();

        if (this.isTransactionPending) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Payment via MetaMask'),
                    message: gettext('Your request is already being processed'),
                    wlcElement: 'notification_deposit-error',
                },
            });
            return;
        }

        try {
            this.isTransactionPending = true;

            if (!metamaskCurrencies.has(paymentMessage.wallet_currency)) {
                // In case of adding withdraw_account field to wrong payment system
                throw {errors: [
                    gettext('Payment via MetaMask is not provided for a payment currency:'),
                    paymentMessage.wallet_currency,
                ]};
            }

            const provider: ethers.providers.Web3Provider = await this.createProvider();
            const depositValue: string = await this.requestDepositValue(paymentMessage.wallet_currency);

            if (!depositValue) {
                throw {errors: gettext('No confirmed amount.')};
            }

            const paymentInfo: IMetamaskDepositData = {
                amount: depositValue,
                currency: paymentMessage.wallet_currency,
                address: paymentMessage.address,
                contractAccount: paymentMessage.metamask_account,
            };

            if (paymentInfo.currency === 'USDT') {
                await this.sendUSDT(provider, paymentInfo);
            } else if (paymentInfo.currency === 'ETH') {
                await this.sendETH(provider, paymentInfo);
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Payment via MetaMask'),
                    message: gettext('Deposit request via MetaMask has been successfully sent.'),
                    wlcElement: 'notification_deposit-success',
                },
            });

            if (this.configService.get<boolean>('$base.finances.metamask.hidePayMessageModalOnSuccess') &&
                this.modalService.getActiveModal('payment-message')) {
                this.modalService.hideModal('payment-message');
            }

        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Payment via MetaMask'),
                    message: error.errors,
                    wlcElement: 'notification_deposit-error',
                },
            });
        } finally {
            this.isTransactionPending = false;
        }
    }

    /**
     * Provide deposit for ETH crypto currency
     * @param {ethers.providers.Web3Provider} provider Web3Provider -
     * abstract connection to the Ethereum network https://docs.ethers.io/v5/api/providers/
     * @param {IMetamaskDepositData} data for payment
     */
    private async sendETH(provider: ethers.providers.Web3Provider, data: IMetamaskDepositData): Promise<void> {
        try {
            const signer: ethers.providers.JsonRpcSigner = provider.getSigner();

            const transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest> = {
                to: data.address,
                value: ethers.utils.parseEther(String(data.amount)),
            };

            const gaslimit: ethers.BigNumber = await provider.estimateGas(transaction);
            // Manually estimate gas to prevent internal error INSUFFICIENT_FUNDS in signer.sendTransaction
            // (internal estimateGas) https://docs.ethers.io/v5/api/utils/logger/#errors--insufficient-funds

            await signer.sendTransaction({...transaction, gasLimit: gaslimit});
        } catch (error) {
            throw this.provideError(error, 'sendETH');
        }
    }

    /**
     * Provide deposit for USDT crypto currency with smart contract https://docs.ethers.io/v5/api/contract/example/
     * @param {ethers.providers.Web3Provider} provider Web3Provider - abstract connection to the Ethereum network
     * https://docs.ethers.io/v5/api/providers/
     * @param {IMetamaskDepositData} data for payment
     */
    private async sendUSDT(provider: ethers.providers.Web3Provider, data: IMetamaskDepositData): Promise<void> {
        try {
            const signer: ethers.providers.JsonRpcSigner = provider.getSigner();

            const abi: string[] = [
                'function decimals() view returns (uint8)',
                'function transfer(address to, uint amount) returns (bool)',
                'function balanceOf(address owner) view returns (uint)',
                'event Transfer(address indexed from, address indexed to, uint amount)',
            ];

            const erc20rw: ethers.Contract = new ethers.Contract(data.contractAccount, abi, signer);

            const address: string = await signer.getAddress();
            const balance: number = +ethers.utils.formatEther(await erc20rw.balanceOf(address));

            if (!balance) {
                // Manually check balance to prevent internal error: UNPREDICTABLE_GAS_LIMIT in erc20rw.transfer
                // https://docs.ethers.io/v5/api/utils/logger/#errors--unpredicatable-gas-limit
                throw {errors: gettext('Not enough money to deposit.')};
            }

            const decimals: ethers.BigNumberish = await erc20rw.decimals();
            const depositAmount: ethers.BigNumber = ethers.utils.parseUnits(String(data.amount), decimals);

            await erc20rw.transfer(
                data.address,
                depositAmount,
            );
        } catch (error) {
            throw this.provideError(error, 'sendUSDT');
        }
    }

    /**
     * Create Web3Provider - abstract connection to the Ethereum network https://docs.ethers.io/v5/api/providers/
     *
     * And check if Ethereum chain is compatible to environment.
     * @returns {ethers.providers.Web3Provider} Web3Provider
     */
    private async createProvider(): Promise<ethers.providers.Web3Provider> {
        try {
            const provider: ethers.providers.Web3Provider = new ethers.providers
                .Web3Provider(this.window.ethereum, 'any');
            await provider.send(metamaskMethods.requestAccounts, []);

            const network: ethers.providers.Network = await provider.getNetwork();

            if (this.isProd && network.chainId !== 1) {
                throw {errors: gettext('Wrong Ethereum chain. Please switch to the Ethereum Main Network (Mainnet).')};
            } else if (!this.isProd && network.chainId !== 4) {
                throw {errors: gettext('Wrong Ethereum chain. Please switch to the Rinkeby Test Network.')};
            }

            return provider;
        } catch (error) {
            throw this.provideError(error, 'createProvider');
        }
    }

    /**
     * Request signature from MetaMask
     * @param message which should be singed
     * @returns {string} metamask signature
     */
    private async requestSignature(message: string): Promise<string> {
        try {
            return await this.window.ethereum.request({
                method: metamaskMethods.personalSign,
                params: [this.accounts[0], message],
            });
        } catch (error) {
            throw this.provideError(error, 'requestSignature');
        }
    }

    /**
     * Requests deposit amount value in wallet currency, by calling a modal window with a form.
     * @param walletCurrency is used for input label
     * @returns `string` value of confirmed amount or
     * `undefined` if modal window is closed without clicking confirm button
     */
    private async requestDepositValue(walletCurrency: string): Promise<string | undefined> {
        let depositValue: string;
        const submitEventName: string = 'DEPOSIT_VALUE_CONFIRMED';
        const waiter$: Subject<void> = new Subject();

        this.eventService.subscribe({name: submitEventName}, (data: IIndexing<string>): void => {
            depositValue = data.amount;
            this.modalService.hideModal('request-deposit-value');
        }, waiter$);

        const modal = await this.modalService.showModal({
            id: 'request-deposit-value',
            modifier: 'request-deposit-value',
            showFooter: false,
            modalTitle: gettext('Enter transaction amount'),
            componentName: 'metamask.wlc-amount-form',
            componentParams: <IAmountFormCParams>{
                submitEventName,
                walletCurrency,
                showMetamaskBlock: true,
                amountLabelText: `${walletCurrency} ${this.translate.instant('Deposit amount')}`,
            },
        });

        await modal.closed;
        waiter$.next();
        waiter$.complete();

        return depositValue;
    }

    /**
     * Requests profile currency, by calling a modal window with a form.
     * @returns {string} `string` value of confirmed currency or
     * `undefined` if modal window is closed without clicking confirm button
     */
    private async requestCurrency(): Promise<string | undefined> {
        let currency: string;
        const submitEventName: string = 'CURRENCY_CHOSEN';
        const waiter$: Subject<void> = new Subject();

        this.eventService.subscribe({name: submitEventName}, (data: IIndexing<string>): void => {
            currency = data.currency;
            this.modalService.hideModal('request-currency');
        }, waiter$);

        const modal = await this.modalService.showModal({
            id: 'request-currency',
            modifier: 'request-currency',
            showFooter: false,
            modalTitle: gettext('Select profile currency to continue registration'),
            componentName: 'metamask.wlc-currency-form',
            componentParams: <ICurrencyFormCParams>{
                submitEventName,
            },
        });

        await modal.closed;
        waiter$.next();
        waiter$.complete();

        return currency;
    }

    /**
     * Creates translated message to be signed.
     * @param {TMetamaskMsgAction} action `'reg' | 'login'`
     * @returns translated `string` message to be signed
     */
    private createMessage(action: TMetamaskMsgAction): string {
        return this.translate.instant(metamaskActionMessages[action])
            + ` ${this.configService.get<string>('$base.site.name')}`
            + ` ${this.translate.instant('on')} `
            + DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
    }

    /**
     * Checks if browser has MetaMask app, otherwise throw error.
     */
    private checkMetamask(): void | never {
        if (!this.isMetamask) {
            throw {errors: gettext(
                'The MetaMask wallet is not installed. Please think about trying MetaMask.',
            )};
        }
    }

    /**
     * Provides specific errors from MetaMask and ethers
     * @param {any} error
     * @param {string} method method name
     * @returns {errors: string[] | string} error object
     */
    private provideError(error: any, method: string): {errors: string[] | string} | any {
        let errors: string[] | string;

        if (_isString(error.code)) {
            // ethers internal https://docs.ethers.io/v5/api/utils/logger/#errors
            errors = gettext('Something went wrong. Please contact with support service.');
            this.logService.sendLog({code: '17.2.0', data: {method, error}});
        } else if (error.code === -32002) {
            // Metamask internal -32002
            errors = gettext('Request is already pending. Please continue with MetaMask app.');
        } else if (error.code < 0 && error.message) {
            // Metamask internal except -32002
            errors = error.message;
            this.logService.sendLog({code: '17.2.1', data: {method, error}});
        } else if (error.code === 4001) {
            // Metamask external error
            errors = error.message;
        } else {
            // Any other unhandled errors
            this.logService.sendLog({code: '17.2.2', data: {method, error}});
        }

        return errors ? {errors} : error;
    }

}
