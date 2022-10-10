import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {ITextBlockCParams} from 'wlc-engine/modules/core/components/text-block/text-block.params';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.params';
import {IHistoryDefault} from 'wlc-engine/modules/core/system/interfaces/history-filter.interface';
import {
    transactionConfig,
    betConfig,
    tournamentConfig,
    bonusesConfig,
    startDate,
    endDate,
} from 'wlc-engine/modules/core/system/config/history.config';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';

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
                    common: {
                        typeAttr: 'submit',
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
                    common: {
                        typeAttr: 'submit',
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
                    common: {
                        typeAttr: 'submit',
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
                    common: {
                        typeAttr: 'submit',
                        text: gettext('Save'),
                    },
                },
            },
        ],
    };

    export const mails: IFormWrapperCParams = {
        class: 'wlc-mails-filters',
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
