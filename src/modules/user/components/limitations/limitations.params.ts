import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ISelectCParams,
    IInputCParams,
    IButtonCParams,
    IWrapperCParams,
    ITableCol,
    ProhibitedPatterns,
} from 'wlc-engine/modules/core';

import {LimitCancelComponent} from 'wlc-engine/modules/user/components/limitations/limit-cancel/limit-cancel.component';
import {LimitValueComponent} from 'wlc-engine/modules/user/components/limitations/limit-value/limit-value.component';
export {limitTypeTexts} from './limitations.shared';

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
    moduleName: 'user',
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
        title: gettext('Period'),
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

export const limitAmount = {
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
            'numberDecimal',
        ],
        locked: false,
        prohibitedPattern: ProhibitedPatterns.notAmountSymbols,
    },
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
        labelText: gettext('Limit time (Reality checker)'),
        wlcElement: 'limit-time',
        common: {
            placeholder: gettext('Limit time (Reality checker)'),
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
        labelText: gettext('Limit time (Time out)'),
        wlcElement: 'limit-time',
        common: {
            placeholder: gettext('Limit time (Time out)'),
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
