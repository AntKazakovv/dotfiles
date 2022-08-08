import {aliasTickerMap} from './../constants/crypto-invoices.constants';
import {BehaviorSubject} from 'rxjs';
import {UserProfile} from './../../../user/system/models/profile.model';
import _assign from 'lodash-es/assign';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';
import _pickBy from 'lodash-es/pickBy';
import _reduce from 'lodash-es/reduce';
import _map from 'lodash-es/map';
import _findIndex from 'lodash-es/findIndex';
import _uniq from 'lodash-es/uniq';
import _isString from 'lodash-es/isString';
import _isEmpty from 'lodash-es/isEmpty';
import _toNumber from 'lodash-es/toNumber';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {FinancesHelper} from '../helpers/finances.helper';
import {IPaymentMessage} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {
    IFromLog,
    ILogObj,
} from 'wlc-engine/modules/core';
import {TPaymentsMethods} from '../interfaces';

export type FilterType = TPaymentsMethods | 'Deposits' | 'Withdraws' | 'all' | 'All';

export type TPaymentSystems = IPaymentSystem[];

export interface IPaymentSystem {
    additional: string;
    additionalParams: IIndexing<IPaymentAdditionalParam> | [];
    alias: string;
    allowiframe: number;
    appearance: string;
    customParams?: IPaymentSystemCustomParams | [];
    description: string;
    description_withdraw?: string;
    disable_amount?: boolean;
    depositMax?: number;
    depositMin?: number;
    hostedFields: IHostedFields | [];
    id: string;
    image: string;
    isPIQCashier?: boolean;
    image_withdraw?: string;
    default_images?: string[];
    lastAccounts: string[];
    lastAccountsObj?: IIndexing<string> | [];
    message: string | IIndexing<string> | IPaymentMessage;
    name: string;
    name_withdraw?: string;
    required: string[];
    required_withdraw: string[];
    showfor: FilterType;
    withdrawMax?: number;
    withdrawMin?: number;
    paymentSuccess?: boolean;
    tokenRequired?: boolean;
    visible?: boolean;
    cryptoInvoice?: boolean;
}

export interface IPaymentAdditionalParam {
    label: string;
    showfor: FilterType;
    name?: string;
    skipsaving?: string;
    optional?: string;
    isHosted?: boolean;
    type?: 'input' | 'select';
    params?: IIndexing<string>;
    value?: string;
}
export interface IPaymentAdditionalParamEx extends Omit<IPaymentAdditionalParam, 'skipsaving' | 'optional'> {
    skipsaving?: number;
    optional?: number;
}

export interface IHostedFields {
    merchantId: string;
    url: string;
    fields: IHostedField[];
    loaded?: boolean;
    errors?: boolean;
    invalid?: boolean;
}

export interface IHostedField {
    type: string;
    name: string;
    label: string;
    error?: string;
    helpKey?: string;
    visible?: string;
    required?: string;
}

export interface IHostedFieldsParams {
    merchantId: string;
    hostedfieldsurl: string;
    fields: IHostedField[];
    styles: any;
    callback: () => void;
    onLoadCallback: () => void;
    el: string;
}

export interface IHostedFieldService {
    setup: (params: IHostedFieldsParams) => void;
    get: () => void;
    reset: () => void;
}

export interface IHostedFormData extends IIndexing<string | IIndexing<string>> {
    errors?: IIndexing<string>;
}

export interface IPaymentSystemCustomParams {
    provider?: string; // PaymentIQ Cashier provider
    merchant_id?: string; // PaymentIQ Cashier merchant ID
}

export interface IFieldTemplate {
    template: string;
    dbName: string;
    label: string;
}

const fieldTemplatesNames: IIndexing<IFieldTemplate> = {
    firstName: {
        template: 'firstName',
        dbName: 'Name',
        label: 'First name',
    },
    lastName: {
        template: 'lastName',
        dbName: 'LastName',
        label: 'Last name',
    },
    birthDay: {
        template: 'birthDate',
        dbName: 'DateOfBirth',
        label: 'Date of birth',
    },
    gender: {
        template: 'gender',
        dbName: 'Gender',
        label: 'Gender',
    },
    idNumber: {
        template: 'idNumber',
        dbName: 'IDNumber',
        label: 'ID number',
    },
    countryCode: {
        template: 'country',
        dbName: 'IDCountry',
        label: 'Country',
    },
    stateCode: {
        template: 'state',
        dbName: 'IDState',
        label: 'State',
    },
    postalCode: {
        template: 'postalCode',
        dbName: 'PostalCode',
        label: 'Postal code',
    },
    city: {
        template: 'city',
        dbName: 'City',
        label: 'City',
    },
    address: {
        template: 'address',
        dbName: 'Address',
        label: 'Address',
    },
    bankName: {
        template: 'bankNameText',
        dbName: 'BankName',
        label: 'Bank name',
    },
    branchCode: {
        template: 'branchCode',
        dbName: 'BranchCode',
        label: 'Branch code',
    },
    swift: {
        template: 'swift',
        dbName: 'Swift',
        label: 'SWIFT',
    },
    ibanNumber: {
        template: 'ibanNumber',
        dbName: 'Iban',
        label: 'Iban number',
    },
    phoneNumber: {
        template: 'mobilePhone',
        dbName: 'Phone',
        label: 'Mobile phone',
    },
};

const disabledReasons = {
    // Apply to payment system if chosen bonus paySystems array doesn't empty
    // and doesn't contain the method id
    1: gettext('The method is not available for the selected bonus.'),
} as const;

export class PaymentSystem extends AbstractModel<IPaymentSystem> {

    public cardFields: boolean;
    public isPayCryptos: boolean = false;
    public isPayCryptosV2: boolean = false;
    public isLastAccountsObj: boolean;
    public isHosted: boolean = false;
    public cryptoCheck: boolean;
    public readonly isCashier: boolean = false;
    public disabledBy: null | keyof typeof disabledReasons = null;

    public isParent: boolean = false;
    public children: PaymentSystem[] = [];

    private hostedFieldService: IHostedFieldService;
    private hostedField: any;

    constructor(
        from: IFromLog,
        data: IPaymentSystem,
        protected userProfile$: BehaviorSubject<UserProfile>,
    ) {
        super({from: _assign({model: 'PaymentSystem'}, from)});
        this.init(data);
        this.isCashier = !!this.data.isPIQCashier;
    }

    public get cryptoTicker(): string {
        return aliasTickerMap[this.alias] || (this.message as IPaymentMessage)?.wallet_currency;
    }

    public get userCurrency(): string {
        return this.userProfile$.getValue()?.currency;
    }

    public get appearance(): string {
        return this.data.appearance;
    }

    public get additional(): string {
        return this.data.additional;
    }

    public get additionalParams(): IIndexing<IPaymentAdditionalParam> {
        return _isArray(this.data.additionalParams) ? {} : this.data.additionalParams;
    }

    public set additionalParams(data: IIndexing<IPaymentAdditionalParam>) {
        this.data.additionalParams = data;
    }

    public get additionalParamsCount(): number {
        return Object.keys(this.data.additionalParams).length;
    }

    public get additionalParamsDeposit(): IIndexing<IPaymentAdditionalParam> {
        return this.getAdditionalParams('deposit');
    }

    public get additionalParamsWithdraw(): IIndexing<IPaymentAdditionalParam> {
        return this.getAdditionalParams('withdraw');
    }

    public get alias(): string {
        return this.data.alias;
    }

    public get allowIframe(): boolean {
        return !!this.data.allowiframe;
    }

    public get customParams(): IPaymentSystemCustomParams {
        return _isArray(this.data.customParams) ? null : this.data.customParams;
    }

    public get defaultImages(): string[] {
        return this.data.default_images || [];
    }

    public get depositMax(): number {
        return this.data.depositMax || 10000;
    }

    public get depositMin(): number {
        return this.data.depositMin || 1;
    }

    public get description(): string {
        return this.data.description;
    }

    public get descriptionWithdraw(): string {
        return this.data.description_withdraw || this.description;
    }

    public get disableAmount(): boolean {
        return this.data.disable_amount;
    }

    public get disabledReason(): string {
        if (this.disabledBy) {
            return disabledReasons[this.disabledBy];
        }
    }

    public get id(): number {
        return +this.data.id;
    }

    public get image(): string {
        return this.data.image;
    }

    public get imageWithdraw(): string {
        return this.data.image_withdraw || this.data.image;
    }

    public get lastAccounts(): string[] {
        return this.data.lastAccounts || [];
    }

    public get lastAccountsObj(): IIndexing<string> {
        return _isArray(this.data.lastAccountsObj) ? {} : this.data.lastAccountsObj;
    }

    public get message(): string | IIndexing<string> | IPaymentMessage {
        return this.data.message || '';
    }

    public set message(data: string | IIndexing<string> | IPaymentMessage) {
        this.data.message = data;
    }

    public get name(): string {
        return this.data.name;
    }

    public get nameWithdraw(): string {
        return this.data.name_withdraw || this.name;
    }

    public get required(): string[] {
        return this.data.required || [];
    }

    public get requiredWithdraw(): string[] {
        return this.data.required_withdraw || [];
    }

    public get showFor(): FilterType {
        return this.data.showfor;
    }

    public get withdrawMax(): number {
        return this.data.withdrawMax || 10000;
    }

    public get withdrawMin(): number {
        return this.data.withdrawMin || 1;
    }

    public get visible(): boolean {
        return this.data.visible || true;
    }

    public get tokenRequired(): boolean {
        return this.data.tokenRequired;
    }

    public get paymentSuccess(): boolean {
        return this.data.paymentSuccess;
    }

    public get hostedFields(): IHostedFields {
        return _isArray(this.data.hostedFields) ? null : this.data.hostedFields;
    }

    public get isCardFields(): boolean {
        return this.cardFields;
    }

    public get cryptoInvoices(): boolean {
        return this.data.cryptoInvoice || false;
    }

    public checkRequiredFields(type: TPaymentsMethods = 'deposit'): IIndexing<IFieldTemplate> {
        const fields = type === 'deposit' ? this.required : this.requiredWithdraw;

        if(_includes(this.required, 'IDState') &&
            !_includes(this.required, 'IDCountry')) {
            this.required.push('IDCountry');
        }

        return _pickBy(fieldTemplatesNames, (value: IFieldTemplate, key: string) => {
            return _includes(fields, value.dbName) &&
                GlobalHelper.getOwnProperty(this.userProfile$.getValue() as any, key) &&
                !_get(this.userProfile$.getValue(), [key, 'length'], false);
        });
    }

    public resetHostedFields(): void {
        this.hostedFieldService.reset();
    }

    public getHostedValue(): void {
        this.hostedFieldService.get();
    }

    public dropHostedFields(): void {
        this.hostedFields.errors = null;
        this.hostedFields.loaded = false;
    }

    public validateHostedFields(): void {
        this.hostedFields.invalid = false;
        this.hostedFields.errors = null;
    }

    public invalidateHostedFields(): void {
        this.hostedFields.invalid = true;
        this.hostedFields.errors = true;
    }

    public loadedHostedFields(): void {
        this.hostedFields.invalid = true;
        this.hostedFields.loaded = true;
    }

    public setupHostedFields(
        formLoadedCallback: () => void,
        formCallback: (formData: IHostedFormData) => void,
        styles: string,
    ): void {
        const params: IHostedFieldsParams = {
            merchantId: this.hostedFields.merchantId,
            hostedfieldsurl: this.hostedFields.url,
            fields: this.hostedFields.fields,
            onLoadCallback: () => formLoadedCallback,
            styles: styles,
            callback: () => formCallback,
            el: '#wlc-hosted-fields',
        };

        params.fields = params.fields.map((conf: IHostedField) => {
            return new this.hostedField(
                conf.type,
                conf.name,
                conf.name,
                conf.label,
                conf.error,
                conf.helpKey,
                conf.visible,
                conf.required,
            );
        });
        this.hostedFieldService.setup(params);
    }

    private init(data: IPaymentSystem): void {
        this.data = data;

        if (!_isArray(this.data.hostedFields) && this.data.hostedFields?.fields?.length) {
            this.isHosted = true;
            this.importPackage();
        }

        this.isLastAccountsObj = !_isEmpty(this.lastAccountsObj);

        if (this.alias.includes('paycryptos')) {
            this.isPayCryptos = true;

            if (this.alias.includes('v2')) {
                this.isPayCryptosV2 = true;
            }
        }

        this.cryptoCheck = !_isString(this.message)
            && (this.message.translate === 'pay_to_address' && this.message.address) ? true : false;

        this.prepareAdditionalFields();
        this.cardFields = this.isWithCardFields();
    }

    private async importPackage(): Promise<void> {
        await import('hosted-fields-sdk')
            .then((m: any) => {
                this.hostedFieldService = m['HostedFields'];
                this.hostedField = m['Field'];
            })
            .catch((error) => {
                const logObj: ILogObj = {
                    code: '7.0.3',
                    flog: {
                        error: error.message ? error.message : error,
                    },
                };
                if (this.id) {
                    logObj.flog.id = this.id;
                }
                this.sendLog(logObj);
            });
    }

    private prepareAdditionalFields(): void {
        const hostedFields: IHostedField[] = _get(this, 'hostedFields.fields', {});

        for (const key in this.data.additionalParams) {
            if (this.additionalParams[key]) {
                this.data.additionalParams[key] = this.getField(this.data.additionalParams[key]);
                this.data.additionalParams[key].isHosted = _findIndex(hostedFields,
                    (f: IHostedField) => f.name === key) !== -1;
                this.setFieldValue(key, this.additionalParams[key]);
            }
        }

        //TODO разобраться с этим ид бонуса
        /*
        const addParams = _get(this.UserService,
            `userProfile.extProfile.paymentSystems.${this.alias}.additionalParams`);

        if (addParams) {
            delete addParams.bonusId;
        }
        */
    }

    private getAdditionalParams(filterType: FilterType): IIndexing<IPaymentAdditionalParam> {
        let fields: IIndexing<IPaymentAdditionalParam> = {};

        fields = _pickBy(this.additionalParams, (field: IPaymentAdditionalParam, key: string) => {
            this.setFieldValue(key, field);
            return (FinancesHelper.isDeposit(field.showfor) && FinancesHelper.isDeposit(filterType))
                || (FinancesHelper.isWithdraw(field.showfor) && FinancesHelper.isWithdraw(filterType));
        });

        return fields;
    }

    private getField(param: string | any): IPaymentAdditionalParamEx {
        let field: IPaymentAdditionalParamEx,
            parsParam: any;
        try {
            parsParam = eval(param);
        } catch {
            parsParam = param;
        }

        if (typeof parsParam === 'object') {
            field = {
                label: parsParam.label,
                name: parsParam.label || parsParam.name,
                type: parsParam.type || 'input',
                showfor: parsParam.showfor || 'all',
                skipsaving: _toNumber(parsParam.skipsaving) || 0,
                optional: _toNumber(parsParam.optional) || 0,
                params: parsParam.data,
            };
        } else if (_isArray(parsParam)) {
            field = {
                label: parsParam[0],
                name: parsParam[0],
                type: parsParam[1],
                showfor: 'all',
                skipsaving: 0,
                params: parsParam[2],
            };
        } else if (typeof parsParam === 'string') {
            field = {
                label: parsParam,
                name: parsParam,
                type: 'input',
                showfor: 'all',
                skipsaving: 0,
            };
        }

        return field;
    }

    private setFieldValue(key: string, field: IPaymentAdditionalParam) {
        if (!field.skipsaving) {
            if (['firstName', 'lastName'].includes(key)) {
                field.value = _get(this.userProfile$.getValue(), key, '');
            } else {
                field.value = _get(this.userProfile$.getValue(),
                    `extProfile.paymentSystems.${this.alias}.additionalParams.${key}`, '');
            }
        }
    }

    private isWithCardFields(): boolean {
        const params = []; //TODO siteconfig.paymentsWithCardFields
        let aliases = [];
        if (params.length) {
            aliases = _reduce(_map(params, 'aliases'), (res, item) => res.concat(item), []);
        }
        return _includes(_uniq(aliases), this.alias);
    }
}
