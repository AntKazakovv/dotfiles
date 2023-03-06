import {BehaviorSubject} from 'rxjs';

import _isArray from 'lodash-es/isArray';
import _isString from 'lodash-es/isString';
import _toNumber from 'lodash-es/toNumber';
import _get from 'lodash-es/get';
import _pickBy from 'lodash-es/pickBy';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {UserProfile} from './../../../user/system/models/profile.model';
import {FinancesHelper} from '../helpers/finances.helper';
import {
    FilterType,
    IPaymentAdditionalParam,
    IPaymentAdditionalParamEx,
    IPaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';

export interface IAdditionalFieldsControllerM {
    additionalParams: IIndexing<IPaymentAdditionalParam>;
    prestepParams: IIndexing<IPaymentAdditionalParam>;
    poststepParams: IIndexing<IPaymentAdditionalParam>;
    getAdditionalParams(filterType: FilterType): IIndexing<IPaymentAdditionalParam>;
}

export class AdditionalFieldsControllerM implements IAdditionalFieldsControllerM {

    constructor(
        private data: IPaymentSystem,
        private userProfile$: BehaviorSubject<UserProfile>,
    ) {
        this.prepareAdditionalFields();
    }

    public get additionalParams(): IIndexing<IPaymentAdditionalParam> {
        return this.data.additionalParams as IIndexing<IPaymentAdditionalParam>;
    }

    public get prestepParams(): IIndexing<IPaymentAdditionalParam> {
        const params: IIndexing<IPaymentAdditionalParam> = {};

        for(let key in this.additionalParams) {
            const field = this.additionalParams[key];

            if (field.prestep) {
                params[key] = field;
            }
        }

        return params;
    }

    public get poststepParams(): IIndexing<IPaymentAdditionalParam> {
        const params: IIndexing<IPaymentAdditionalParam> = {};

        for(let key in this.additionalParams) {
            const field = this.additionalParams[key];

            if (!field.prestep) {
                params[key] = field;
            }
        }

        return params;
    }

    public getAdditionalParams(filterType: FilterType): IIndexing<IPaymentAdditionalParam> {
        let fields: IIndexing<IPaymentAdditionalParam> = {};

        fields = _pickBy(this.additionalParams, (field: IPaymentAdditionalParam, key: string) => {
            this.setFieldValue(key, field);
            return (FinancesHelper.isDeposit(field.showfor) && FinancesHelper.isDeposit(filterType))
                || (FinancesHelper.isWithdraw(field.showfor) && FinancesHelper.isWithdraw(filterType));
        });

        return fields;
    }

    private prepareAdditionalFields(): void {
        for (const key in this.data.additionalParams) {
            if (this.data.additionalParams[key]) {
                this.data.additionalParams[key] = this.getField(this.data.additionalParams[key]);
                this.setFieldValue(key, this.data.additionalParams[key]);
            }
        }
    }

    private setFieldValue(key: string, field: IPaymentAdditionalParam) {
        if (!field.skipsaving) {
            if (['firstName', 'lastName'].includes(key)) {
                field.value = _get(this.userProfile$.getValue(), key, '');
            } else {
                field.value = _get(this.userProfile$.getValue(),
                    `extProfile.paymentSystems.${this.data.alias}.additionalParams.${key}`, '');
            }
        }
    }

    private getField(param: string | any): IPaymentAdditionalParamEx {
        let field: IPaymentAdditionalParamEx,
            parsParam: any;

        try {
            parsParam = eval(param);
        } catch {
            parsParam = param;
        }

        if (_isArray(parsParam)) {
            field = {
                label: parsParam[0],
                name: parsParam[0],
                type: parsParam[1],
                showfor: 'all',
                skipsaving: 0,
                params: parsParam[2],
            };
        } else if (typeof parsParam === 'object') {
            field = {
                label: parsParam.label,
                name: parsParam.label || parsParam.name,
                type: parsParam.type || 'input',
                showfor: parsParam.showfor || 'all',
                skipsaving: _toNumber(parsParam.skipsaving) || 0,
                optional: _toNumber(parsParam.optional) || 0,
                params: parsParam.data,
                prestep: _toNumber(parsParam.prestep) || 0,
            };
        } else if (_isString(parsParam)) {
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
}
