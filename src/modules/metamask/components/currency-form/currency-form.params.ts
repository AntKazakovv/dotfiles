import {
    IComponentParams,
    CustomType,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ICurrencyFormCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** By default 'CURRENCY_CONFIRMED' */
    submitEventName?: string;
    /** Default form config */
    formConfig?: IFormWrapperCParams,
};

export const defaultParams: ICurrencyFormCParams = {
    class: 'wlc-currency-form',
    componentName: 'wlc-currency-form',
    moduleName: 'metamask',
    submitEventName: 'CURRENCY_CONFIRMED',
    formConfig: {
        components: [
            FormElements.currency,
            {
                name: 'core.wlc-button',
                params: {
                    common: {
                        text: gettext('Select'),
                    },
                    customMod: ['submit'],
                },
            },
        ],
    },
};
