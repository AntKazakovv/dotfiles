import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {
    get as _get,
    includes as _includes,
    has as _has,
    pickBy as _pickBy,
    reduce as _reduce,
    map as _map,
    uniq as _uniq,
    cloneDeep as _cloneDeep,
    isArray as _isArray,
    findIndex as _findIndex,
} from 'lodash-es';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {FinancesHelper} from '../helpers/finances.helper';
import {ICryptoMessage} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';

export type FilterType = 'deposit' | 'Deposits' | 'withdraw' | 'Withdraws' | 'all' | 'All';

export interface IPaymentSystem {
    additional: string;
    additionalParams: IIndexing<IPaymentAdditionalParam>;
    alias: string;
    allowiframe: number;
    appearance: string;
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
    message: string | IIndexing<string> | ICryptoMessage;
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

const fieldTemplatesNames = {
    firstName: {
        template: 'first-name',
        dbName: 'Name',
        label: 'First name',
    },
    lastName: {
        template: 'last-name',
        dbName: 'LastName',
        label: 'Last name',
    },
    birthDay: {
        template: 'birthdate',
        dbName: 'DateOfBirth',
        label: 'Date of birth',
    },
    gender: {
        template: 'gender',
        dbName: 'Gender',
        label: 'Gender',
    },
    idNumber: {
        template: 'id-number',
        dbName: 'IDNumber',
        label: 'ID number',
    },
    countryCode: {
        template: 'country',
        dbName: 'IDCountry',
        label: 'Country',
    },
    postalCode: {
        template: 'postal-code',
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
        template: 'bank-name-text',
        dbName: 'BankName',
        label: 'Bank name',
    },
    branchCode: {
        template: 'branch-code',
        dbName: 'BranchCode',
        label: 'Branch code',
    },
    swift: {
        template: 'swift',
        dbName: 'Swift',
        label: 'SWIFT',
    },
    ibanNumber: {
        template: 'iban-number',
        dbName: 'Iban',
        label: 'Iban number',
    },
    phoneNumber: {
        template: 'mobile-phone',
        dbName: 'Phone',
        label: 'Mobile phone',
    },
};

export class PaymentSystem extends AbstractModel<IPaymentSystem> {

    public cardFields: boolean;
    public isPayCryptosV2: boolean;

    constructor(data: IPaymentSystem, protected UserService: UserService) {
        super();
        this.init(data);
        // TODO: remove when finished tiket #181785
        if (this.alias.includes('paycryptos') && this.alias.includes('v2')) {
            this.data.lastAccounts = [];
            this.isPayCryptosV2 = true;
        }
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

    public get cryptoCheck(): boolean {
        if ((typeof(this.message) !== 'string')
            && (this.message.translate === 'pay_to_address' && this.message.address)) {
            return true;
        }
        return false;
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

    public get message(): string | IIndexing<string> | ICryptoMessage {
        return this.data.message;
    }

    public set message(data: string | IIndexing<string> | ICryptoMessage) {
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

    public checkRequiredFields(): object {

        return _pickBy(fieldTemplatesNames, (value, key) => {
            return _includes(this.required, value.dbName) &&
                GlobalHelper.getOwnProperty(this.UserService.userProfile as any, key) &&
                !_get(this.UserService.userProfile, [key, 'length'], false);
        });
    }

    protected prepareAdditionalFields(): void {
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

    protected getAdditionalParams(filterType: FilterType): IIndexing<IPaymentAdditionalParam> {
        let fields: IIndexing<IPaymentAdditionalParam> = {};

        fields = _pickBy(this.additionalParams, (field: IPaymentAdditionalParam, key: string) => {
            this.setFieldValue(key, field);
            return (FinancesHelper.isDeposit(field.showfor) && FinancesHelper.isDeposit(filterType))
                || (FinancesHelper.isWithdraw(field.showfor) && FinancesHelper.isWithdraw(filterType));
        });

        return fields;
    }

    protected getField(param: string | any): IPaymentAdditionalParam {
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

    protected setFieldValue(key: string, field: IPaymentAdditionalParam) {
        if (!field.skipsaving) {
            if (['firstName', 'lastName'].includes(key)) {
                field.value = _get(this.UserService, `userProfile.${key}`, '');
            } else {
                field.value = _get(this.UserService,
                    `userProfile.extProfile.paymentSystems.${this.alias}.additionalParams.${key}`, '');
            }
        }
    }

    protected init(data: IPaymentSystem): void {
        this.data = data;
        this.prepareAdditionalFields();
        this.cardFields = this.isWithCardFields();

        gettext('Withdraw Address');
        gettext('Card number');
        gettext('Card Expire (09/21)');
        gettext('Card code (cvv)');
    }

    protected isWithCardFields(): boolean {
        const params = []; //TODO siteconfig.paymentsWithCardFields
        let aliases = [];
        if (params.length) {
            aliases = _reduce(_map(params, 'aliases'), (res, item) => res.concat(item), []);
        }
        return _includes(_uniq(aliases), this.alias);
    }
}
