import {BehaviorSubject} from 'rxjs';

import _assign from 'lodash-es/assign';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';
import _pickBy from 'lodash-es/pickBy';
import _isEmpty from 'lodash-es/isEmpty';
import _isObject from 'lodash-es/isObject';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {aliasTickerMap} from './../constants/crypto-invoices.constants';
import {UserProfile} from './../../../user/system/models/profile.model';
import {IPaymentMessage} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {IFromLog} from 'wlc-engine/modules/core';
import {
    TPaymentsMethods,
    TPaySystemTagAll,
    TPaySystemTag,
} from '../interfaces';

import {
    IFormCallback,
    IHostedFieldsControllerM,
    HostedFieldsControllerM,
} from 'wlc-engine/modules/finances/system/classes/hosted-fields.controller';
import {
    IAdditionalFieldsControllerM,
    AdditionalFieldsControllerM,
} from 'wlc-engine/modules/finances/system/classes/additional-fields.controller';

export type FilterType = TPaymentsMethods | 'Deposits' | 'Withdraws' | 'all' | 'All';

export interface IHostedFormData extends IIndexing<string | IIndexing<string>> {
    errors?: IIndexing<string>;
}

export interface IPaymentSystem {
    additional: string;
    additionalParams: IIndexing<IPaymentAdditionalParam> | [];
    alias: string;
    allowiframe: number;
    appearance: string;
    customParams?: IPaymentSystemCustomParams | [];
    depositFeatures?: 'prestep' | string;
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
    tokenRequired?: boolean;
    cryptoInvoice?: boolean;
    tags?: TPaySystemTag[];
}

export interface IHostedFields {
    merchantId: string;
    url: string;
    fields: IHostedField[];
    loaded?: boolean;
    loadedError?: boolean;
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
    prestep?: string;
}
export interface IPaymentAdditionalParamEx extends Omit<IPaymentAdditionalParam,'skipsaving' | 'optional' | 'prestep'> {
    skipsaving?: number;
    optional?: number;
    prestep?: number;
}

export interface IPaymentSystemCustomParams {
    provider?: string; // PaymentIQ Cashier provider
    merchant_id?: string; // PaymentIQ Cashier merchant ID
    pregeneration_request?: boolean; // To pre-request payment information for Kauri
}

export interface IFieldTemplate {
    template: string;
    dbName: string;
    label: string;
}

const disabledReasons = {
    // Apply to payment system if chosen bonus paySystems array doesn't empty
    // and doesn't contain the method id
    1: gettext('The method is not available for the selected bonus.'),
} as const;

export class PaymentSystem extends AbstractModel<IPaymentSystem> {

    public readonly isPayCryptos: boolean;
    public readonly isKauri: boolean;
    public readonly isCashier: boolean;
    public readonly isPayCryptosV2: boolean;
    public readonly isLastAccountsObj: boolean;
    public readonly isPregeneration: boolean;
    public readonly isPrestep: boolean;

    public disabledBy: null | keyof typeof disabledReasons = null;
    public isParent: boolean = false;
    public autoSelect: boolean = false;

    protected isCryptoCheck: boolean;
    protected hostedController: IHostedFieldsControllerM;
    protected additionalController: IAdditionalFieldsControllerM;
    protected childrenSystems: PaymentSystem[] = [];

    constructor(
        from: IFromLog,
        data: IPaymentSystem,
        protected userProfile$: BehaviorSubject<UserProfile>,
        protected fieldTemplatesNames: IIndexing<IFieldTemplate>,
    ) {
        super({from: _assign({model: 'PaymentSystem'}, from)});
        this.init(data);

        if (!_isArray(this.data.hostedFields) && !_isEmpty(this.data.hostedFields?.fields)) {
            this.hostedController = new HostedFieldsControllerM(this.data);
        }

        if (!_isArray(this.data.additionalParams) && !_isEmpty(this.data.additionalParams)) {
            this.additionalController = new AdditionalFieldsControllerM(this.data, this.userProfile$);
        }

        this.isPrestep = this.depositFeatures === 'prestep';
        this.isPayCryptos = this.alias.includes('paycryptos');
        this.isKauri = _includes(this.data.alias, 'kauri');
        this.isLastAccountsObj = !_isEmpty(this.data.lastAccountsObj);
        this.isPregeneration = !!(this.data.customParams as IPaymentSystemCustomParams)?.pregeneration_request;

        if (this.isPayCryptos) {
            this.isPayCryptosV2 = this.data.alias.includes('v2');
        }

        this.isCashier = !!this.data.isPIQCashier;
    }

    public get isHosted(): boolean {
        return !!this.hostedController;
    }

    public get children(): PaymentSystem[] {
        return this.childrenSystems;
    }

    public set children(systems: PaymentSystem[]) {
        if (systems.length) {
            this.childrenSystems = systems;
            this.isParent = true;
        } else {
            this.isParent = false;
        }
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

    public get prestepParams(): IIndexing<IPaymentAdditionalParam> {
        return this.additionalController ? this.additionalController.prestepParams : {};
    }

    public get poststepParams(): IIndexing<IPaymentAdditionalParam> {
        return this.additionalController ? this.additionalController.poststepParams : {};
    }

    public get additionalParams(): IIndexing<IPaymentAdditionalParam> {
        return this.additionalController ? this.additionalController.additionalParams : {};
    }

    public set additionalParams(data: IIndexing<IPaymentAdditionalParam>) {
        this.data.additionalParams = data;
    }

    public get additionalParamsDeposit(): IIndexing<IPaymentAdditionalParam> {
        return this.additionalController ? this.additionalController.getAdditionalParams('deposit') : {};
    }

    public get additionalParamsWithdraw(): IIndexing<IPaymentAdditionalParam> {
        return this.additionalController ? this.additionalController.getAdditionalParams('withdraw') : {};
    }

    public get alias(): string {
        return this.data.alias;
    }

    public get allowIframe(): boolean {
        return !!this.data.allowiframe;
    }

    public get cryptoCheck(): boolean {
        return this.isCryptoCheck;
    }

    public get customParams(): IPaymentSystemCustomParams {
        return _isArray(this.data.customParams) ? null : this.data.customParams;
    }

    public get defaultImages(): string[] {
        return this.data.default_images || [];
    }

    public get depositFeatures(): string {
        return this.data.depositFeatures || '';
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
        this.cryptoChecking();
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

    public get tokenRequired(): boolean {
        return this.data.tokenRequired;
    }

    public get hostedFields(): IHostedFields | null {
        return this.hostedController ? this.hostedController.hostedFields : null;
    }

    public get cryptoInvoices(): boolean {
        return this.data.cryptoInvoice || false;
    }

    public get tags(): TPaySystemTagAll[] {
        return this.data.tags?.length ? this.data.tags : ['other'];
    }

    public get isReadyHostedController(): Promise<boolean> {
        return this.hostedController.ready.promise;
    }

    public checkRequiredFields(type: TPaymentsMethods = 'deposit'): IIndexing<IFieldTemplate> {
        const fields = type === 'deposit' ? this.required : this.requiredWithdraw;

        if(_includes(this.required, 'IDState') &&
            !_includes(this.required, 'IDCountry')) {
            this.required.push('IDCountry');
        }

        return _pickBy(this.fieldTemplatesNames, (value: IFieldTemplate, key: string) => {
            return _includes(fields, value.dbName) &&
                GlobalHelper.getOwnProperty(this.userProfile$.getValue() as any, key) &&
                !_get(this.userProfile$.getValue(), [key, 'length'], false);
        });
    }

    public clearHostedFields(): boolean {
        if (this.hostedController) {
            this.hostedController.resetHostedFields();
            this.hostedController.dropHostedFields();
            return true;
        } else {
            return false;
        }
    }

    public resetHostedFields(): void {
        if (this.hostedController) {
            this.hostedController.resetHostedFields();
        }
    }

    public getHostedValue(): void {
        if (this.hostedController) {
            this.hostedController.getHostedValue();
        }
    }

    public dropHostedFields(): void {
        if (this.hostedController) {
            this.hostedController.dropHostedFields();
        }
    }

    public validateHostedFields(): void {
        if (this.hostedController) {
            this.hostedController.validateHostedFields();
        }
    }

    public invalidateHostedFields(): void {
        if (this.hostedController) {
            this.hostedController.invalidateHostedFields();
        }
    }

    public loadedHostedFields(): void {
        if (this.hostedController) {
            this.hostedController.loadedHostedFields();
        }
    }

    public setupHostedFields(
        formLoadedCallback: () => void,
        formCallback: IFormCallback,
        styles: string,
    ): void {
        if (this.hostedController) {
            this.hostedController.setupHostedFields(formLoadedCallback, formCallback, styles);
        }
    }

    private init(data: IPaymentSystem): void {
        this.data = data;
        this.cryptoChecking();
    }

    private cryptoChecking(): void {
        this.isCryptoCheck = _isObject(this.data.message) &&
        ((this.data.message as IPaymentMessage).translate === 'pay_to_address' &&
        (this.data.message as IPaymentMessage).address) ? true : false;
    }
}
