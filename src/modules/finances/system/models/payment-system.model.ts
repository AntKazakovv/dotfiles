import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {FinancesHelper} from '../helpers/finances.helper';
import {IPaymentMessage} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {IFromLog} from 'wlc-engine/modules/core';

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

export type FilterType = 'deposit' | 'Deposits' | 'withdraw' | 'Withdraws' | 'all' | 'All';

export interface IPaymentSystem {
    additional: string;
    additionalParams: IIndexing<IPaymentAdditionalParam>;
    alias: string;
    allowiframe: number;
    appearance: string;
    customParams?: IPaymentSystemCustomParams;
    description: string;
    description_withdraw?: string;
    disable_amount: boolean;
    depositMax: number;
    depositMin: number;
    hostedFields: IHostedFields;
    id: number;
    image: string;
    image_withdraw?: string;
    lastAccounts: string[];
    lastAccountsObj?: IIndexing<string>;
    message: string | IIndexing<string> | IPaymentMessage;
    name: string;
    name_withdraw?: string;
    required: string[];
    showfor: FilterType;
    withdrawMax: number;
    withdrawMin: number;
    paymentSuccess?: boolean;
    tokenRequired?: boolean;
    visible?: boolean;
}

export interface IPaymentAdditionalParam {
    name: string;
    showfor: FilterType;
    skipsaving?: number;
    optional?: number;
    isHosted?: boolean;
    type?: 'input' | 'select';
    params?: IIndexing<string>;
    value?: string;
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

export class PaymentSystem extends AbstractModel<IPaymentSystem> {

    public cardFields: boolean;
    public isPayCryptos: boolean = false;
    public isPayCryptosV2: boolean = false;
    public isLastAccountsObj: boolean;
    public isHosted: boolean = false;
    public cryptoCheck: boolean;
    public isCashier: boolean = false;

    private hostedFieldService: IHostedFieldService;
    private hostedField: any;

    constructor(
        from: IFromLog,
        data: IPaymentSystem,
        protected UserService: UserService,
    ) {
        super({from: _assign({model: 'PaymentSystem'}, from)});
        this.init(data);
    }

    public get appearance(): string {
        return this.data.appearance;
    }

    public get additional(): string {
        return this.data.additional;
    }

    public get additionalParams(): IIndexing<IPaymentAdditionalParam> {
        return this.data.additionalParams;
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
        return this.data.customParams;
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

    public get id(): number {
        return this.data.id;
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
        return this.data.lastAccountsObj || {};
    }

    public get message(): string | IIndexing<string> | IPaymentMessage {
        return this.data.message;
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
        return this.data.hostedFields;
    }

    public get isCardFields(): boolean {
        return this.cardFields;
    }

    public checkRequiredFields(): IIndexing<IFieldTemplate> {

        return _pickBy(fieldTemplatesNames, (value: IFieldTemplate, key: string) => {
            return _includes(this.required, value.dbName) &&
                GlobalHelper.getOwnProperty(this.UserService.userProfile as any, key) &&
                !_get(this.UserService.userProfile, [key, 'length'], false);
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

        if (this.data.hostedFields.fields?.length) {
            this.isHosted = true;
            this.importPackage();
        }

        this.isLastAccountsObj = !_isEmpty(this.lastAccountsObj);

        if (this.alias.includes('paycryptos')) {
            this.isPayCryptos = true;

            if (this.alias.includes('v2')) {
                this.isPayCryptosV2 = true;
            }
        } else if (this.alias.includes('paymentiq_cashier')) {
            this.isCashier = true;
        }


        this.cryptoCheck = !_isString(this.message)
            && (this.message.translate === 'pay_to_address' && this.message.address) ? true : false;

        this.prepareAdditionalFields();
        this.cardFields = this.isWithCardFields();
    }

    private async importPackage(): Promise<void> {
        await import('hosted-fields-sdk').then((m: any) => {
            this.hostedFieldService = m['HostedFields'];
            this.hostedField = m['Field'];
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

    private getField(param: string | any): IPaymentAdditionalParam {
        let field: IPaymentAdditionalParam,
            parsParam: any;
        try {
            parsParam = eval(param);
        } catch {
            parsParam = param;
        }

        if (typeof parsParam === 'object') {
            field = {
                name: parsParam.label || parsParam.name,
                type: parsParam.type || 'input',
                showfor: parsParam.showfor || 'all',
                skipsaving: parsParam.skipsaving || 0,
                optional: parsParam.optional || 0,
                params: parsParam.data,
            };
        } else if (_isArray(parsParam)) {
            field = {
                name: parsParam[0],
                type: parsParam[1],
                showfor: 'all',
                skipsaving: 0,
                params: parsParam[2],
            };
        } else if (typeof parsParam === 'string') {
            field = {
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
                field.value = _get(this.UserService, `userProfile.${key}`, '');
            } else {
                field.value = _get(this.UserService,
                    `userProfile.extProfile.paymentSystems.${this.alias}.additionalParams.${key}`, '');
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
