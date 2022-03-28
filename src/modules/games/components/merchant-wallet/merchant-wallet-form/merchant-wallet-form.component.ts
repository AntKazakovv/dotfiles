import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import _isObject from 'lodash-es/isObject';
import _forEach from 'lodash-es/forEach';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isArray from 'lodash-es/isArray';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IFormWrapperCParams,
    IPushMessageParams,
    IValidatorSettings,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IAmountLimitCParams} from 'wlc-engine/modules/core/components/amount-limit/amount-limit.params';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {UserInfo} from 'wlc-engine/modules/user';
import {
    IMerchantWalletBalance,
    MerchantWalletService,
} from 'wlc-engine/modules/games/system/services/merchant-wallet/merchant-wallet.service';

import * as Params from './merchant-wallet-form.params';

@Component({
    selector: '[wlc-merchant-wallet-form]',
    templateUrl: './merchant-wallet-form.component.html',
    styleUrls: ['./styles/merchant-wallet-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MerchantWalletFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IMerchantWalletFormCParams;

    public $params: Params.IMerchantWalletFormCParams;
    public merchantWalletBalance: IMerchantWalletBalance;
    public formConfig: IFormWrapperCParams;
    public isUpdatePending: boolean;
    protected isSubmitPending: boolean;
    protected value: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMerchantWalletFormCParams,
        protected configService: ConfigService,
        protected merchantWalletService: MerchantWalletService,
        protected eventService: EventService,
        protected logService: LogService,
        protected translateService: TranslateService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.merchantWalletBalance = this.merchantWalletService.balance;
        this.setFormConfig();
        this.getBalance();
    }

    public get merchantName(): string {
        return this.merchantWalletService.merchant.alias;
    }

    /**
     * Update balance handler
     */
    public handleUpdate(): void {
        if (!this.isUpdatePending) {
            this.getBalance();
        }
    }

    /**
     * Submit transfer form handler
     * @param form FormGroup
     */
    public async handleSubmit(form: FormGroup): Promise<void> {
        this.isSubmitPending = true;
        form.disable();

        try {
            const amount = form.controls['amount'].value;
            const {method} = this.$params;

            await this.merchantWalletService.transferFunds(method, amount);

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: this.merchantName,
                    message: [
                        method === 'deposit'
                            ? gettext('Transfer to the provider`s wallet has been successfully sent!')
                            : gettext('Transfer from the provider`s wallet has been successfully completed!'),
                        this.translateService.instant(method === 'deposit'
                            ? gettext('Deposit sum')
                            : gettext('Withdraw sum'))
                        + ': ' + amount + ' ' + this.merchantWalletService.userCurrency,
                    ],
                },
            });
        } catch (error) {
            this.logService.sendLog({
                code: `21.0.${this.$params.method === 'deposit' ? 1 : 2}`,
                data: error,
                from: {
                    service: 'MerchantWalletFormComponent',
                    method: 'transferFunds',
                },
            });
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: this.merchantName,
                    message: _isArray(error.errors)
                        ? error.errors
                        : gettext('Something went wrong. Please try again later.'),
                },
            });
        } finally {
            this.isSubmitPending = false;
            form.enable();
        }

    }

    /**
     * Gets form to subscribe the amount value
     * @param form FormGroup
     */
    public getForm(form: FormGroup): void {
        form.controls['amount']?.valueChanges
            .pipe(takeUntil(this.$destroy))
            .subscribe((amount: number): void => {
                this.value.next(amount);
            });
    }

    protected async getBalance(): Promise<void> {
        try {
            this.isUpdatePending = true;
            this.merchantWalletBalance = await this.merchantWalletService.getMWBalance();
        } catch (error) {
            this.logService.sendLog({
                code: '21.0.0',
                data: error,
                from: {
                    component: 'MerchantWalletFormComponent',
                    method: 'getBalance',
                },
            });
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: this.merchantName,
                    message: error.errors,
                },
            });
        } finally {
            this.isUpdatePending = false;
            this.setFormConfig();
        }
    }

    protected setFormConfig(): void {
        const {method} = this.$params;

        const config = this.merchantWalletService.merchantConfig;

        const components: IFormComponent[] = [];

        let amount = _cloneDeep(FormElements.amount);
        const amountLimits: IAmountLimitCParams = {
            showLimits: true,
        };

        const userBalance = this.configService
            .get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .getValue()?.realBalance || 0;

        _forEach(amount.params.validators, (val: IValidatorSettings | string): void => {
            if (_isObject(val)) {
                if (val.name === 'min') {
                    val.options = method === 'withdraw'
                        ? config.minWithdraw
                        : config.minDeposit;
                    amountLimits.minValue = val.options;
                } else if (val.name === 'max') {
                    val.options = method === 'withdraw'
                        ? config.maxWithdraw || this.merchantWalletBalance?.available
                        : config.maxDeposit || userBalance;
                    amountLimits.maxValue = val.options;
                }
            }
        });

        components.push({
            name: 'core.wlc-wrapper',
            params: {
                class: 'wlc-field-container',
                components: [
                    amount,
                    {
                        name: 'core.wlc-wrapper',
                        params: {
                            class: 'wlc-amount-limit__wrap',
                            components: [
                                {
                                    name: 'core.wlc-amount-limit',
                                    params: amountLimits,
                                },
                            ],
                        },
                    },
                ],
            },
        });

        if (config.currency && this.merchantWalletService.userCurrency !== config.currency) {
            components.push({
                name: 'games.wlc-merchant-wallet-exrate',
                params: {
                    currency: this.merchantWalletService.userCurrency,
                    value: this.value,
                },
            });
        }

        this.formConfig = {
            class: `${method}-form`,
            components: [
                ...components,
                {
                    name: 'core.wlc-button',
                    params: {
                        name: 'submit',
                        wlcElement: `button_${method}`,
                        common: {
                            text: method === 'deposit' ? gettext('Add') : gettext('Withdraw'),
                        },
                        customMod: ['submit', method],
                    },
                },
            ],
        };

        this.cdr.markForCheck();
    }

}
