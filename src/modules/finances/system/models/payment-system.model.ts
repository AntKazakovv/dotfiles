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
} from 'lodash';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

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
    message: string | IIndexing<string>;
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
    skipsaving: number;
    isHosted?: boolean;
    type?: 'input' | 'select';
    params?: IIndexing<string>;
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

    protected cardFields: boolean;

    constructor(data: IPaymentSystem, protected user: UserService) {
        super();
        this.data = data;
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

    public get alias(): string {
        return this.data.alias;
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

    public get message(): string | IIndexing<string> {
        return this.data.message;
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

    /* public get paymentAdditionalParams(): IIndexing<string> {
        return this.data.add
    } */

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
        console.log('xx',Object.getOwnPropertyDescriptor(this.user.userProfile.__proto__, 'currency11'));
        return _pickBy(fieldTemplatesNames, (value, key) => {

            return _includes(this.required, value.dbName) && Object.getOwnPropertyDescriptor((this.user.userProfile as any).__proto__, key)
                && !_get(this.user.userProfile, [key, 'length'], false);
        });
    }

    /* public getAdditionalParams(filterType: FilterType): void {
        const additionalParams = angular.copy(this.additionalParams),
            depositType: FilterType[] = ['deposit', 'Deposits', 'all', 'All'],
            withdrawType: FilterType[] = ['withdraw', 'Withdraws', 'all', 'All'],
            hostedFields: IHostedField[] = _get(this, 'hostedFields.fields', {});
        let fields: IPaymentAdditionalParams = {};

        for (const key in additionalParams) {
            if (additionalParams[key]) {
                fields[key] = this.getField(additionalParams[key]);
                fields[key].isHosted = _findIndex(hostedFields, (f: IHostedField) => f.name === key) !== -1;
            }
        }

        fields = _pickBy(fields, (field: IPaymentAdditionalParam) => {
            return (depositType.includes(field.showfor) && depositType.includes(filterType))
                || (withdrawType.includes(field.showfor) && withdrawType.includes(filterType));
        });

        this.additionalParams = fields;
        this.additionalParamsCount = Object.keys(this.additionalParams).length;

        const addParams: IIndexing<string> = _get(this.user.userProfile.extProfile, `paymentSystems${this.alias}.additionalParams`, {});

        if (addParams) {
            delete addParams.bonusId;
        }

        this.paymentAdditionalParams = addParams;
    } */

    protected async init(): Promise<void> {
        this.cardFields = this.isWithCardFields();
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
