import {FormControl} from '@angular/forms';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IFormWrapperCParams,
    ISelectCParams,
    ITextBlockCParams,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {IRadioButtonsCParams} from 'wlc-engine/modules/core/components/radio-buttons/radio-buttons.params';
import {IDatepickerCParams} from 'wlc-engine/modules/core/components/datepicker/datepicker.params';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export type HistoryFilterConfigType = 'transaction' | 'bonus' | 'bet';

export interface IHistoryFilterCParams extends IComponentParams<Theme, Type, ThemeMod> {
    config: HistoryFilterConfigType,
    defaultValues: {[field: string]: unknown};
    icon?: string;
};

export const defaultParams: Partial<IHistoryFilterCParams> = {
    class: 'wlc-history-filter',
};

export namespace formConfig {

    export const transaction: IFormWrapperCParams = {
        class: 'wlc-transaction-wrapper',
        components: [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockTitle: gettext('Filter'),
                    },
                },
            },
            {
                name: 'core.wlc-radio-buttons',
                params: <IRadioButtonsCParams>{
                    name: 'filterType',
                    common: {
                        placeholder: gettext('Sort by'),
                    },
                    items: [
                        {
                            value: 'all',
                            title: gettext('All'),
                        },
                        {
                            value: 'deposit',
                            title: gettext('Deposit'),
                        },
                        {
                            value: 'withdraw',
                            title: gettext('Withdraw'),
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-datepicker',
                params: <IDatepickerCParams>{
                    name: 'startDate',
                    label: gettext('Start Date'),
                    customMod: ['start'],
                },
            },
            {
                name: 'core.wlc-datepicker',
                params: <IDatepickerCParams>{
                    name: 'endDate',
                    label: gettext('End Date'),
                    customMod: ['end'],
                    datepickerOptions: {
                        alignSelectorRight: true,
                    },
                },
            },
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    name: 'submit',
                    common: {
                        text: gettext('Save'),
                    },
                },
            },
        ],
    };

    export const bonus: IFormWrapperCParams = {
        class: 'wlc-bonuses-filters',
        components: [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockTitle: gettext('Filter'),
                    },
                },
            },
            {
                name: 'core.wlc-select',
                params: <ISelectCParams>{
                    name: 'filterType',
                    common: {
                        placeholder: gettext('Sort by'),
                    },
                    theme: 'vertical',
                    labelText: gettext('Sort by'),
                    items: [
                        {
                            value: 'all',
                            title: 'All',
                        },
                        {
                            value: '-100',
                            title: 'Expired',
                        },
                        {
                            value: '-99',
                            title: 'Canceled',
                        },
                        {
                            value: '100',
                            title: 'Wagered',
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    name: 'submit',
                    common: {
                        text: gettext('Save'),
                    },
                },
            },
        ],
    };

    export const tournamentHistoryFilter = {
        name: 'core.wlc-select',
        alwaysNew: {saveValue: true},
        params: <ISelectCParams>{
            value: 'all',
            name: 'filterType',
            common: {
                placeholder: gettext('Sort by'),
            },
            theme: 'vertical',
            labelText: gettext('Sort by'),
            control: new FormControl('all'),
            items: [
                {
                    value: 'all',
                    title: gettext('All'),
                },
                {
                    value: '0',
                    title: gettext('Selected'),
                },
                {
                    value: '1',
                    title: gettext('Qualified'),
                },
                {
                    value: '-99',
                    title: gettext('Canceled'),
                },
                {
                    value: '99',
                    title: gettext('Ending'),
                },
                {
                    value: '100',
                    title: gettext('Ended'),
                },
            ],
        },
    };

    export const tournaments: IFormWrapperCParams = {
        class: 'wlc-tournaments-filters',
        components: [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockTitle: gettext('Filter'),
                    },
                },
            },
            tournamentHistoryFilter,
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    name: 'submit',
                    common: {
                        text: gettext('Save'),
                    },
                },
            },
        ],
    };

    export const bet: IFormWrapperCParams = {
        class: 'wlc-bet-filters',
        components: [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockTitle: gettext('Filter'),
                    },
                },
            },
            {
                name: 'core.wlc-datepicker',
                params: <IDatepickerCParams>{
                    name: 'startDate',
                    label: gettext('Start Date'),
                    customMod: ['start'],
                },
            },
            {
                name: 'core.wlc-datepicker',
                params: <IDatepickerCParams>{
                    name: 'endDate',
                    label: gettext('End Date'),
                    customMod: ['end'],
                    datepickerOptions: {
                        alignSelectorRight: true,
                    },
                },
            },
            {
                name: 'core.wlc-select',
                params: <ISelectCParams>{
                    name: 'filterType',
                    common: {
                        placeholder: gettext('Merchants'),
                    },
                    theme: 'vertical',
                    labelText: gettext('Merchants'),
                    options: 'merchants',
                },
            },
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    name: 'submit',
                    common: {
                        text: gettext('Save'),
                    },
                },
            },
        ],
    };
}
