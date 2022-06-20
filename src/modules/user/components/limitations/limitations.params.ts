import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ISelectCParams,
    IInputCParams,
    IButtonCParams,
    TIndexingLimitTypeItems,
} from 'wlc-engine/modules/core';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';

import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';
import {LimitCancelComponent} from './limit-cancel/limit-cancel.component';
import {LimitValueComponent} from './limit-value/limit-value.component';
export {limitTypeTexts} from './limitations.shared';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ILimitationsCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: ILimitationsCParams = {
    moduleName: 'user',
    componentName: 'wlc-limitations',
    class: 'wlc-limitations',
};

export const tableConfig: ITableCol[] = [
    {
        key: 'typeText',
        title: gettext('Limit Type'),
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
        title: gettext('Action'),
        type: 'component',
        order: 30,
        componentClass: LimitCancelComponent,
        wlcElement: 'wlc-profile-table__cell_action',
    },
];

export const limitTypeItems: TIndexingLimitTypeItems = {
    MaxDepositSum: {
        title: gettext('Deposit Limit'),
        value: 'MaxDepositSum',
    },
    MaxBetSum: {
        title: gettext('Wager Limit'),
        value: 'MaxBetSum',
    },
    MaxLossSum: {
        title: gettext('Loss Limit'),
        value: 'MaxLossSum',
    },
    realityChecker: {
        title: gettext('Reality checker'),
        value: 'realityChecker',
    },
    timeOut: {
        title: gettext('Time out'),
        value: 'timeOut',
    },
};

export const limitType = {
    name: 'core.wlc-select',
    params: <ISelectCParams>{
        name: 'limitType',
        labelText: gettext('Limit Type'),
        wlcElement: 'limit-type',
        common: {
            placeholder: gettext('Limit Type'),
            // tooltipText: 'info',
            tooltipModal: 'staticText',
            tooltipModalParams: {
                slug: 'responsible-game',
            },
        },
        validators: ['required'],
        locked: false,
        items: [
            limitTypeItems.MaxDepositSum,
            limitTypeItems.MaxBetSum,
            limitTypeItems.MaxLossSum,
            limitTypeItems.realityChecker,
            limitTypeItems.timeOut,
        ],
    },
};

export const limitAmount = {
    name: 'core.wlc-input',
    params: <IInputCParams>{
        name: 'limitAmount',
        customMod: ['amount'],
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
                title: gettext('Each Week'),
                value: 'Week',
            },
            {
                title: gettext('Each Month'),
                value: 'Month',
            },
        ],
    },
};

export const submitBtn = {
    name: 'core.wlc-button',
    params: <IButtonCParams>{
        name: 'submit',
        common: {
            text: gettext('Save'),
        },
    },
};

export const realityCheckerPeriod = {
    name: 'core.wlc-select',
    params: <ISelectCParams>{
        name: 'limitTime',
        labelText: gettext('Limit Time (Reality Checker)'),
        wlcElement: 'limit-time',
        common: {
            placeholder: gettext('Limit Time (Reality Checker)'),
        },
        validators: ['required'],
        locked: false,
        items: [
            {
                title: gettext('30 Minutes'),
                value: '30',
            },
            {
                title: gettext('1 Hour'),
                value: '60',
            },
            {
                title: gettext('5 Hours'),
                value: '300',
            },
        ],
    },
};

export const timeOutPeriod = {
    name: 'core.wlc-select',
    params: <ISelectCParams>{
        name: 'limitTime',
        labelText: gettext('Limit Time (Time Out)'),
        wlcElement: 'limit-time',
        common: {
            placeholder: gettext('Limit Time (Time Out)'),
        },
        validators: ['required'],
        locked: false,
        items: [
            {
                title: gettext('1 Day'),
                value: '1',
            },
            {
                title: gettext('1 Week'),
                value: '7',
            },
            {
                title: gettext('1 Month'),
                value: '30',
            },
            {
                title: gettext('Indefinite'),
                value: '36525',
            },
        ],
    },
};
