import {
    IFormWrapperCParams,
    ITextBlockCParams,
    IButtonCParams,
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IHistoryDefault} from 'wlc-engine/modules/finances/system/interfaces/history-filter.interface';
import {
    transactionConfig,
    betConfig,
    tournamentConfig,
    bonusesConfig,
    startDate,
    endDate,
} from 'wlc-engine/modules/finances/system/config/history.config';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IHistoryFilterCParams extends IComponentParams<Theme, Type, ThemeMod> {
    config: keyof IHistoryDefault,
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
                params: transactionConfig.filterRadioBtn,
            },
            {
                name: 'core.wlc-datepicker',
                params: startDate,
            },
            {
                name: 'core.wlc-datepicker',
                params: endDate,
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
                params: startDate,
            },
            {
                name: 'core.wlc-datepicker',
                params: endDate,
            },
            {
                name: 'core.wlc-select',
                params: betConfig.filterSelect,
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
            {
                name: 'core.wlc-select',
                params: tournamentConfig.filterSelect,
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
                params: bonusesConfig.filterSelect,
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
