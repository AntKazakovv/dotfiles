import {Component, OnInit, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {StateService} from '@uirouter/core';
import {FormGroup} from '@angular/forms';

import {
    AbstractComponent,
    IIndexing,
    IMixedParams,
    ConfigService,
    EventService,
    ModalService,
    ValidationService,
    ISelectCParams,
    IInputCParams,
} from 'wlc-engine/modules/core';
import {
    IPaymentAdditionalParam,
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';

import * as Params from './deposit-withdraw.params';

import {
    isString as _isString,
    isEqual as _isEqual,
    each as _each,
} from 'lodash-es';

@Component({
    selector: '[wlc-deposit-withdraw]',
    templateUrl: './deposit-withdraw.component.html',
    styleUrls: ['./styles/deposit-withdraw.component.scss'],
})
export class DepositWithdrawComponent extends AbstractComponent implements OnInit {

    public $params: Params.IDepositWithdrawCParams;
    public currentSystem: PaymentSystem;
    public depositFrom = Params.depositForm;
    public withdrawFrom = Params.withdrawFrom;
    public title: string = gettext('Deposit');
    public requiredFields: Object = {};
    public requiredFieldsKeys: string[] = [];
    public additionalParams: IIndexing<IPaymentAdditionalParam> = {};

    public listConfig: IPaymentListCParams = {
        paymentType: 'deposit',
    };

    public additionalFields: Params.IAdditionalFields[] = [];
    protected additionalForm: FormGroup;

    protected inProgress: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IDepositWithdrawCParams,
        protected configService: ConfigService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected validationService: ValidationService,
        protected stateService: StateService,

    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.eventService.subscribe({
            name: 'select_system',
            from: 'finances',
        }, (system: PaymentSystem) => {
            this.currentSystem = system;
            this.additionalParams = this.listConfig.paymentType === 'deposit' ?
                system.additionalParamsDeposit : system.additionalParamsWithdraw;

            const formColtrols: IIndexing<FormControl> = {};
            this.additionalFields = Object.keys(this.additionalParams).map((key) => {
                const field = this.additionalParams[key];
                formColtrols[key] = new FormControl('', [
                    this.validationService.getValidator('required').validator,
                ]);

                if (field.type === 'input') {
                    return {
                        type: 'input',
                        params: <IInputCParams>{
                            name: key,
                            theme: 'vertical',
                            common: {
                                placeholder: field.name,
                            },
                            control: formColtrols[key],
                        },
                    };
                }
                if (field.type === 'select') {

                    return {
                        type: 'select',
                        params: <ISelectCParams>{
                            labelText: field.name,
                            name: key,
                            theme: 'vertical',
                            common: {
                                placeholder: field.name,
                            },
                            items: Object.keys(field.params || {}).map((item) => {
                                return {
                                    value: item,
                                    title: field.params[item],
                                };
                            }),
                            control: formColtrols[key],
                        },
                    };
                }
            });

            this.additionalForm = new FormGroup(formColtrols);
            this.checkUserProfileForPayment();
        }, this.$destroy);

        if (this.$params.mode === 'withdraw') {
            this.title = gettext('Withdrawal');
            this.listConfig.paymentType = 'withdraw';
        }
    }

    public async deposit(form: FormGroup): Promise<void> {
        if (this.inProgress) {
            return;
        }

        if (!this.currentSystem) {
            this.modalService.showModal({
                id: 'deposit-error',
                modifier: 'error',
                modalTitle: gettext('Error'),
                modalMessage: [gettext('You must select payment method')],
                size: 'sm',
            });
            return;
        }

        if (!this.checkAdditionFields()) {
            return;
        }

        this.inProgress = true;

        try {
            const response = await this.financesService.deposit(
                this.currentSystem.id,
                form.value.amount,
                this.additionalForm.value,
            );

            if (response.length) {
                if (response[0] === 'message' || response[0] === 'markup') {
                    this.showDepositResponse(response[1], response[0]);
                    return;
                } else if (response[0] === 'redirect') {
                    if (this.currentSystem?.appearance === 'newtab') {
                        window.open(response[1], '_blank');
                    } else {
                        window.location.replace(response[1]);
                    }
                    return;
                } else if (response[0] === 'markup_redirect') {
                    this.modalService.showModal({
                        id: 'deposit-redirect-notification',
                        modifier: 'info',
                        modalTitle: gettext('Redirect'),
                        modalMessage: gettext('You will be redirected in a moment'),
                        size: 'sm',
                    });

                    await this.createRedirectForm(response[1]?.html);
                    return;
                }
            }

            const formSubmit: HTMLFormElement = this.createForm(response.data);
            document.body.appendChild(formSubmit);
            formSubmit.submit();
        } catch (error) {
            this.modalService.showModal({
                id: 'deposit-error',
                modifier: 'error',
                modalTitle: gettext('Error'),
                modalMessage: error.errors?.length ? error.errors : gettext('Something went wrong. Please try again later.'),
                size: 'sm',
            });
        } finally {
            this.inProgress = false;
        }
    }

    public async withdraw(form: FormGroup): Promise<void> {
        if (this.inProgress) {
            return;
        }

        if (!this.currentSystem) {
            this.modalService.showModal({
                id: 'deposit-error',
                modifier: 'error',
                modalTitle: gettext('Error'),
                modalMessage: [gettext('You must select payment method')],
                size: 'sm',
            });
            return;
        }

        if (!this.checkAdditionFields()) {
            return;
        }

        this.inProgress = true;

        try {
            const response = await this.financesService.withdraw(
                this.currentSystem.id,
                form.value.amount,
                this.additionalForm.value,
            );

            if (response[0] === 'redirect') {
                window.location.replace(response[1]);
                return;
            }

            this.modalService.showModal({
                id: 'withdraw-reponse',
                modalTitle: gettext('Withdraw'),
                modifier: 'info',
                modalMessage: [
                    gettext('Withdraw request has been successfully sent!'),
                    gettext('Withdraw sum') + ' ' + new CurrencyPipe('en-US', 'EUR').transform(form.value.amount),
                ],
            });

            form.controls['amount'].setValue('');
            form.controls['amount'].markAsUntouched();
            this.currentSystem = null;

        } catch (error) {
            this.modalService.showModal({
                id: 'withdraw-error',
                modifier: 'error',
                modalTitle: gettext('Error'),
                modalMessage: error.errors?.length
                    ? error.errors.filter((i: unknown) => _isString(i))
                    : gettext('Something went wrong. Please try again later.'),
                size: 'sm',
            });
        } finally {
            this.inProgress = false;
        }
    }

    public checkUserProfileForPayment(): boolean {
        if (!this.currentSystem) {
            return true;
        }
        const checkedRequiredFields = this.currentSystem.checkRequiredFields();
        if (!_isEqual(this.requiredFields, checkedRequiredFields)) {
            this.requiredFields = checkedRequiredFields;
        }

        this.requiredFieldsKeys = Object.keys(this.requiredFields);

        return !Object.keys(this.requiredFields).length;
    }

    public editProfile(): void {
        this.stateService.go('app.profile.main.info');
    }

    protected checkAdditionFields(): boolean {
        if (this.additionalForm.valid) {
            return true;
        }
        _each(this.additionalForm.controls, (control) => {
            control.markAsTouched();
        });
        return false;
    }

    /**
     * Creates iframe with given html with form and inserts it into the body
     *
     * @param html {String} HTML with redirecting form.
     */
    protected async createRedirectForm(html: string): Promise<void> {
        return await new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            try {
                const incomingDoc = new DOMParser().parseFromString(html, 'text/html');
                const form = incomingDoc.querySelector('form');
                form.setAttribute('target', '_parent');

                setTimeout(() => {
                    iframe.contentWindow.document.write(new XMLSerializer().serializeToString(incomingDoc));
                    resolve();
                }, 0);
            } catch (err) {
                document.body.removeChild(iframe);
                reject(err);
            }
        });
    }

    protected showDepositResponse(params: string, type: string): void {
        // const messageData {
        //     messageType: 'success',
        //     messageTitle: this.gettext('Payment'),
        //     templateUrl: '/static/js/templates/dialogs/' + type + 'Payment.html',
        //     dismissAll: true,
        //     backdrop: 'static'
        // };

        // if (type === 'message') {
        //     messageData.messageText = params;
        // } else {
        //     messageData.paymentInfo = params;
        // }

        // this.EventService.emit({name: 'PAYMENT_INIT_SUCCESS'});

        // this.ModalService.showMessage(messageData);

        // if (type === 'message') {
        //     this.paymentSystem = undefined;
        //     this.action = _assign({}, this.actionTemplate);
        // }
    }

    protected createForm(response: any): HTMLFormElement {
        const form: HTMLFormElement = document.createElement('form');
        form.method = response[0];
        form.action = (response[1] && response[1].URL) ? response[1].URL : '';

        if (this.currentSystem.appearance === 'iframe') {
            form.target = 'deposit_frame';
        } else if (this.currentSystem.appearance === 'newtab') {
            form.target = '_blank';
        }

        for (const key in response[1]) {
            if (key === 'URL' || !response[1].hasOwnProperty(key)) {
                continue;
            }

            form.appendChild(this.addField(key, response[1][key]));
        }

        form.style.display = 'none';
        return form;
    }

    protected addField(name: string, value: any): HTMLInputElement {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.value = value;
        return input;
    }
}
