import {
    ISelectCParams,
    IInputCParams,
    IButtonCParams,
    IWrapperCParams,
    ITableCol,
    CustomType,
    IComponentParams,
    IFormComponent,
} from 'wlc-engine/modules/core';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';
import {ILimitationTypeItem} from 'wlc-engine/modules/user/submodules/limitations/system/interfaces';
import {limitType as limitTypes} from 'wlc-engine/modules/core/system/config/base/limitations.config';
import {
    LimitValueComponent,
} from 'wlc-engine/modules/user/submodules/limitations/components/limit-value/limit-value.component';
import {
    LimitCancelComponent,
} from 'wlc-engine/modules/user/submodules/limitations/components/limit-cancel/limit-cancel.component';
export {limitTypeTexts} from 'wlc-engine/modules/user/submodules/limitations/system/config/limitations.config';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ILimitationsCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
}

export const defaultParams: ILimitationsCParams = {
    moduleName: 'limitations',
    componentName: 'wlc-limitations',
    class: 'wlc-limitations',
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No limitations set'),
                },
            },
        ],
    },
};

export const tableConfig: ITableCol[] = [
    {
        key: 'typeText',
        title: gettext('Limit type'),
        type: 'text',
        order: 10,
        wlcElement: 'wlc-profile-table__cell_type',
    },
    {
        key: 'amountValue',
        title: gettext('Value'),
        type: 'component',
        order: 20,
        componentClass: LimitValueComponent,
        wlcElement: 'wlc-profile-table__cell_amount',
    },
    {
        key: 'type',
        title: gettext('Actions'),
        type: 'component',
        order: 30,
        componentClass: LimitCancelComponent,
        wlcElement: 'wlc-profile-table__cell_action',
    },
];

export const limitType = {
    name: 'core.wlc-select',
    params: <ISelectCParams>{
        name: 'limitType',
        labelText: gettext('Limit type'),
        wlcElement: 'limit-type',
        common: {
            placeholder: gettext('Limit type'),
        },
        validators: ['required'],
        locked: false,
    },
};

export const limitAmount = (useZeroBalance: boolean): IFormComponent => {
    const limitAmountConfig = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            name: 'limitAmount',
            customMod: ['amount'],
            theme: 'vertical',
            showCurrency: true,
            common: {
                placeholder: gettext('Amount'),
                customModifiers: 'right-shift',
                type: 'number',
            },
            wlcElement: 'limit_amount',
            validators: [
                'required',
            ],
            locked: false,
            prohibitedPattern: ProhibitedPatterns.notAmountSymbols,
        },
    };

    if (!useZeroBalance) {
        limitAmountConfig.params.validators.push('numberDecimal');
    }

    return limitAmountConfig;
};

export const limitPeriod = {
    name: 'core.wlc-select',
    params: <ISelectCParams>{
        name: 'limitPeriod',
        labelText: gettext('Period'),
        wlcElement: 'limit-period',
        common: {
            placeholder: gettext('Period'),
        },
        validators: ['required'],
        locked: false,
        items: [
            {
                title: gettext('Each day'),
                value: 'Day',
            },
            {
                title: gettext('Each week'),
                value: 'Week',
            },
            {
                title: gettext('Each month'),
                value: 'Month',
            },
        ],
    },
};

export const submitBtn = {
    name: 'core.wlc-button',
    params: <IButtonCParams>{
        common: {
            typeAttr: 'submit',
            text: gettext('Save'),
        },
    },
};

export const realityCheckerPeriod = {
    name: 'core.wlc-select',
    params: <ISelectCParams>{
        name: 'limitTime',
        labelText: gettext('Limit time'),
        wlcElement: 'limit-time',
        common: {
            placeholder: gettext('Limit time'),
        },
        validators: ['required'],
        locked: false,
        items: [
            {
                title: gettext('30 minutes'),
                value: '30',
            },
            {
                title: gettext('1 hour'),
                value: '60',
            },
            {
                title: gettext('5 hours'),
                value: '300',
            },
        ],
    },
};

export const timeOutPeriod = {
    name: 'core.wlc-select',
    params: <ISelectCParams>{
        name: 'limitTime',
        labelText: gettext('Limit time'),
        wlcElement: 'limit-time',
        common: {
            placeholder: gettext('Limit time'),
        },
        validators: ['required'],
        locked: false,
        items: [
            {
                title: gettext('1 day'),
                value: '1',
            },
            {
                title: gettext('1 week'),
                value: '7',
            },
            {
                title: gettext('1 month'),
                value: '30',
            },
            {
                title: gettext('Permanently'),
                value: '36525',
            },
        ],
    },
};

export const selfExclusion = (isRomaniaLicense: boolean): IFormComponent => {
    return {
        name: 'core.wlc-select',
        params: <ISelectCParams>{
            name: 'selfExclusion',
            labelText: gettext('Self exclusion'),
            wlcElement: 'self-exclusion',
            common: {
                placeholder: gettext('Self exclusion'),
            },
            validators: ['required'],
            locked: false,
            items: [
                {
                    title: gettext('1 day'),
                    value: 'day',
                },
                {
                    title: gettext('1 week'),
                    value: 'week',
                },
                {
                    title: gettext('1 month'),
                    value: 'month',
                },
                isRomaniaLicense ?
                    {
                        title: gettext('6 months'),
                        value: '6months',
                    }
                    : null,
                {
                    title: gettext('Permanently'),
                    value: 'permanently',
                },
            ],
        },
    };
};

export const limitTypesForMalta: ILimitationTypeItem[] = [
    limitTypes.MaxDepositSum,
    limitTypes.MaxBetSum,
    limitTypes.MaxLossSum,
    limitTypes.realityChecker,
    limitTypes.selfExclusion,
    limitTypes.timeOut,
];

export const limitTypesForRomania: ILimitationTypeItem[] = [
    limitTypes.MaxDepositSum,
    limitTypes.accountClosure,
    limitTypes.selfExclusion,
];
