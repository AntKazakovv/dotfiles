import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {StateService} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';
import {
    filter,
    pairwise,
    takeUntil,
} from 'rxjs/operators';

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
    ICheckboxCParams,
    IFormWrapperCParams,
    IExtProfilePaymentSystems,
} from 'wlc-engine/modules/core';
import {
    IPaymentAdditionalParam,
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';
import {FormElements} from 'wlc-engine/modules/finances/system/config';
import {
    AddProfileInfoComponent,
    IAddProfileInfoCParams,
} from './add-profile-info';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IModalConfig} from 'wlc-engine/modules/core/components/modal';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {CryptoDataComponent} from '../crypto-data/crypto-data.component';
import {ICryptoMessage} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core/system/services/notification';
import {FinancesHelper} from '../../system/helpers/finances.helper';

import * as Params from './deposit-withdraw.params';

import {
    assign as _assign,
    camelCase as _camelCase,
    cloneDeep as _cloneDeep,
    each as _each,
    extend as _extend,
    forEach as _forEach,
    has as _has,
    isEmpty as _isEmpty,
    isEqual as _isEqual,
    isString as _isString,
    transform as _transform,
} from 'lodash-es';

@Component({
    selector: '[wlc-deposit-withdraw]',
    templateUrl: './deposit-withdraw.component.html',
    styleUrls: ['./styles/deposit-withdraw.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositWithdrawComponent extends AbstractComponent implements OnInit {

    public showModalCryptoPayment: boolean = true;
    public $params: Params.IDepositWithdrawCParams;
    public cryptoCheck: boolean = false;
    public disableAmount: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public currentSystem: PaymentSystem;
    public formType: string = '';
    public depositForm = Params.depositForm;
    public depositFormCrypto = Params.depositFormCrypto;
    public withdrawForm = Params.withdrawForm;
    public title: string = gettext('Deposit');
    public requiredFields: Object = {};
    public requiredFieldsKeys: string[] = [];
    public additionalParams: IIndexing<IPaymentAdditionalParam> = {};

    public listConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
    };

    public baseFields: {[key: string]: Params.FieldType} = {};
    public baseForm: FormGroup;

    public additionalFields: Params.IAdditionalFields[] = [];
    protected additionalForm: FormGroup;

    protected profileForm: IFormWrapperCParams;

    protected inProgress: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IDepositWithdrawCParams,
        protected configService: ConfigService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected validationService: ValidationService,
        protected stateService: StateService,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public get hideAmountField(): boolean {
        if (this.requiredFieldsKeys.length) {
            return true;
        }

        if (this.$params.mode === 'deposit' && this.disableAmount.value) {
            return true;
        }

        return false;
    }

    public get showPayCryptosV2Text(): boolean {
        if (this.currentSystem?.isPayCryptosV2 && !this.cryptoCheck && this.$params.mode === 'deposit') {
            return  true;
        }
        return false;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initFields();
        this.initSubscribers();

        if (this.$params.mode === 'withdraw') {
            this.title = gettext('Withdrawal');
            this.listConfig.paymentType = 'withdraw';
        }
    }

    public sendForm(): void {
        if (this.inProgress) {
            return;
        }

        const {mode} = this.$params;
        const notificationTitle = mode === 'deposit' ? gettext('Deposit') : gettext('Withdraw');

        if (!this.currentSystem) {
            this.pushNotification({
                type: 'error',
                title: notificationTitle,
                message: gettext('You must select payment method'),
            });
            return;
        }

        if (this.requiredFieldsKeys.length) {
            this.pushNotification({
                type: 'error',
                title: notificationTitle,
                message: gettext('You must fill required profile fields'),
            });
            return;
        }

        if (this.baseForm.invalid) {
            this.baseForm.markAllAsTouched();
            this.pushNotification({
                type: 'error',
                title: notificationTitle,
                message: gettext('Fill required fields'),
            });
            return;
        }

        if (mode === 'deposit') {
            this.deposit(this.baseForm);
        } else if (mode === 'withdraw') {
            this.withdraw(this.baseForm);
        }
    }

    public async deposit(form: FormGroup, saveProfile: boolean = false): Promise<void> {

        if (this.additionalForm && !this.checkAdditionFields()) {
            return;
        }

        this.inProgress = true;
        this.modalService.showModal('dataIsProcessing');

        try {
            const response = await this.financesService.deposit(
                this.currentSystem.id,
                this.currentSystem.disableAmount ? this.currentSystem.depositMin : form.value.amount,
                this.additionalForm?.value || {},
            );

            if (saveProfile) {
                await this.saveProfile();
            }

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
                    this.pushNotification({
                        type: 'warning',
                        title: gettext('Deposit'),
                        message: gettext('You will be redirected in a moment!'),
                    });

                    await this.createRedirectForm(response[1]?.html);
                    return;
                }
            }

            const formSubmit: HTMLFormElement = this.createForm(response);
            document.body.appendChild(formSubmit);
            formSubmit.submit();
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Deposit'),
                message: FinancesHelper.errorToMessage(error),
            });
        } finally {
            this.modalService.closeModal('data-is-processing');
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    public async withdraw(form: FormGroup, saveProfile: boolean = false): Promise<void> {
        if (this.inProgress) {
            return;
        }

        if (this.additionalForm && !this.checkAdditionFields()) {
            return;
        }

        this.modalService.showModal('dataIsProcessing');
        this.inProgress = true;

        try {
            const response = await this.financesService.withdraw(
                this.currentSystem.id,
                form.value.amount,
                this.additionalForm?.value || {},
            );

            if (saveProfile) {
                await this.saveProfile();
            }

            if (response[0] === 'redirect') {
                window.location.replace(response[1]);
                return;
            }

            this.pushNotification({
                type: 'success',
                title: gettext('Withdraw'),
                message: [
                    gettext('Withdraw request has been successfully sent!'),
                    gettext('Withdraw sum') + ' ' + new CurrencyPipe('en-US', 'EUR').transform(form.value.amount),
                ],
            });

            this.resetPaymentSystem();

        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Error'),
                message: FinancesHelper.errorToMessage(error),
            });
        } finally {
            this.modalService.closeModal('data-is-processing');
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    public async saveProfile(): Promise<boolean> {
        const deferred = new Deferred<boolean>(),
            profile: UserProfile = this.userService.userProfile,
            paymentSystems: IExtProfilePaymentSystems = profile.extProfile.paymentSystems || {},
            alias: string = this.currentSystem?.alias;

        paymentSystems[alias] = paymentSystems[alias] || {};
        paymentSystems[alias].additionalParams = this.checkSkipSaving();

        /* if (_has(this.action.additional, 'currentPassword')) {
            (profile as any).currentPassword = this.action.additional.currentPassword;
            delete this.action.additional.currentPassword;
        } */

        profile.extProfile.paymentSystems = paymentSystems;

        try {
            this.userService.updateProfile(profile);
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: this.$params.mode === 'deposit' ? gettext('Deposit error') : gettext('Withdraw error'),
                    message: FinancesHelper.errorToMessage(error),
                },
            });
        }

        return deferred.promise;
    }

    public checkUserProfileForPayment(): boolean {
        if (!this.currentSystem) {
            return;
        }

        this.profileForm = undefined;

        const checkedRequiredFields = this.currentSystem.checkRequiredFields();

        if (!_isEqual(this.requiredFields, checkedRequiredFields)) {
            this.requiredFields = checkedRequiredFields;
        }

        this.requiredFieldsKeys = Object.keys(this.requiredFields);

        if (this.requiredFieldsKeys.length) {
            const fields = _transform(this.requiredFields, (result, item) => {
                const template = _camelCase(item['template']);
                if (FormElements[template]) {
                    result.push(FormElements[template]);
                } else {
                    console.error(`Field '${template}' does not exist!`, item);
                }
            }, []);
            fields.push(FormElements.password);
            fields.push(FormElements.submit);

            this.profileForm = {
                components: fields,
                validators: ['required'],
            };
        }

        this.cdr.markForCheck();
    }

    public editProfile(): void {

        this.modalService.showModal({
            id: 'add-profile-info',
            modifier: 'add-profile-info',
            component: AddProfileInfoComponent,
            componentParams: <IAddProfileInfoCParams>{
                formConfig: this.profileForm,
                themeMod: this.requiredFieldsKeys.length > 5 ? 'overflow' : '',
            },
            showFooter: false,
            dismissAll: true,
            backdrop: 'static',
        });
    }

    protected resetPaymentSystem(): void {
        this.eventService.emit({
            name: 'select_system',
            from: 'finances',
        });
    }

    protected setAdditionalValues(): void {

        if (!Object.keys(this.currentSystem.additionalParams).length) {
            return;
        }

        const savedAdditional: IExtProfilePaymentSystems = this.userService.userProfile.extProfile?.paymentSystems;

        if (savedAdditional?.[this.currentSystem.alias]) {
            delete savedAdditional[this.currentSystem.alias].additionalParams.bonusId;
            for(const key in savedAdditional[this.currentSystem.alias].additionalParams) {
                if (_has(this.additionalParams, key)) {
                    this.additionalParams[key].value = savedAdditional[this.currentSystem.alias].additionalParams[key];
                }
            }
        }
    }

    protected checkSkipSaving(): IIndexing<string> {
        const additionalParams: IIndexing<string> = {};

        for (const key in this.additionalParams) {
            if (!this.currentSystem?.additionalParams[key]?.skipsaving) {
                additionalParams[key] = this.additionalForm.value[key];
            }
        }

        return additionalParams;
    }

    protected checkAdditionFields(): boolean {
        if (this.additionalForm && !this.additionalForm.valid) {
            _each(this.additionalForm.controls, (control) => {
                control.markAsTouched();
            });
            return false;
        }
        return true;
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

    protected showDepositResponse(params: ICryptoMessage, type: string): void {
        this.currentSystem.message = params;

        const messageData: IModalConfig = {
            id: 'payment-message',
            modalTitle: gettext('Payment'),
            modifier: 'info',
            component: CryptoDataComponent,
            componentParams: {
                themeMod: 'modal',
                system: this.currentSystem,
            },
            dismissAll: true,
            backdrop: 'static',
        };

        if (this.showModalCryptoPayment) {
            this.modalService.showModal(messageData);
        }

        if (type === 'message') {
            if ((typeof(params) !== 'string')
            && (!this.showModalCryptoPayment && params.translate === 'pay_to_address' && params.address)) {
                this.currentSystem.additionalParams = undefined;
                this.cdr.markForCheck();
            } else {
                this.resetPaymentSystem();
            }
        }
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

    protected initFields(): void {
        this.baseForm = new FormGroup({});

        this.baseFields['amount'] = _assign({
            wlcElement: 'block_amount',
            control: new FormControl('', [
                Validators.required,
                this.validationService.getValidator('numberDecimal').validator,
            ]),
        }, FormElements.amount.params);
        this.toggleFormField('amount', true);

        if (this.$params.mode === 'deposit') {
            this.baseFields['rules'] = _assign({
                wlcElement: 'block_payment-checkbox',
                control: new FormControl('', [Validators.requiredTrue]),
            }, FormElements.rules.params);
            this.toggleFormField('rules', true);
        }

        this.baseFields['submit'] = _assign(
            {},
            this.$params.mode === 'withdraw' ? FormElements.withdrawButton.params : FormElements.depositButton.params,
        );

        this.cdr.markForCheck();
    }

    protected updateFields(): void {
        this.toggleFormField('amount', !this.disableAmount.getValue());
        this.cdr.markForCheck();
    }

    protected initSubscribers(): void {

        this.eventService.subscribe(
            {
                name: 'select_system',
                from: 'finances',
            },
            (system: PaymentSystem) => this.onPaymentSystemChange(system),
            this.$destroy,
        );

        this.eventService.subscribe(
            {name: 'PROFILE_UPDATE'},
            () => this.onProfileUpdate(),
            this.$destroy,
        );

        this.disableAmount
            .pipe(
                pairwise(),
                filter(([prev, current]) => prev !== current),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.onDisableAmountChange();
            });
    }

    protected onDisableAmountChange(): void {
        if (this.$params.mode === 'deposit') {
            this.updateFields();
        }
    }

    protected onProfileUpdate(): void {
        this.financesService.fetchPaymentSystems().then(() => {
            this.checkUserProfileForPayment();
        });
    }

    protected onPaymentSystemChange(system: PaymentSystem): void {
        if (!system) {
            this.currentSystem = undefined;
            this.requiredFields = {};
            this.requiredFieldsKeys.length = 0;
            this.cryptoCheck = false;
            this.disableAmount.next(false);
            this.baseForm.reset();
            this.baseForm.removeControl('additionalForm');
            this.additionalFields.length = 0;
            this.cdr.markForCheck();
            return;
        }

        this.currentSystem = system;
        this.setAdditionalValues();

        this.cryptoCheck = this.currentSystem.cryptoCheck && this.$params.mode === 'deposit';
        this.disableAmount.next(this.currentSystem.disableAmount);

        this.setAmountValidators();
        this.additionalParams = this.listConfig.paymentType === 'deposit' ?
            system.additionalParamsDeposit : system.additionalParamsWithdraw;

        this.baseForm.removeControl('additionalForm');
        this.additionalForm = undefined;
        this.additionalFields.length = 0;

        if (!_isEmpty(this.additionalParams)) {
            const formControls: IIndexing<FormControl> = {};
            this.additionalFields = Object.keys(this.additionalParams).map((key) => {
                const field = this.additionalParams[key];
                formControls[key] = new FormControl('', [
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
                            control: formControls[key],
                            validators: ['required'],
                        },
                    };
                } else if (field.type === 'select') {
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
                            control: formControls[key],
                            validators: ['required'],
                        },
                    };
                }
            });

            this.additionalForm = new FormGroup(formControls);
            this.baseForm.addControl('additionalForm', this.additionalForm);
        }

        this.checkUserProfileForPayment();
    }

    protected setAmountValidators(): void {
        const {mode} = this.$params;
        const {depositMin, depositMax, withdrawMin, withdrawMax} = this.currentSystem;
        const amount = (this.baseFields.amount['control'] as FormControl);

        amount.clearValidators();
        amount.setValidators([
            Validators.required,
            this.validationService.getValidator('numberDecimal').validator,
            Validators.min(mode === 'deposit' ? depositMin : withdrawMin),
            Validators.max(mode === 'deposit' ? depositMax : withdrawMax),
        ]);

    }

    protected toggleFormField(name: string, show: boolean): void {
        switch (name) {
            case 'amount':
                if (show) {
                    this.baseForm.addControl(
                        (this.baseFields.amount as IInputCParams).name,
                        (this.baseFields.amount as IInputCParams).control,
                    );
                } else {
                    this.baseForm.removeControl('amount');
                }
                break;

            case 'rules':
                if (show) {
                    this.baseForm.addControl(
                        (this.baseFields.rules as ICheckboxCParams).name,
                        (this.baseFields.rules as ICheckboxCParams).control,
                    );
                } else {
                    this.baseForm.removeControl('rules');
                }
                break;
        }
    }

    protected pushNotification(params: IPushMessageParams): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: params,
        });
    }
}
