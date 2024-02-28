import {IButtonCParams, IInputCParams} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'modal' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IDepositPromoCodeCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    inlineFormParams?: IDepositPromoCodeFormCParams,
    modalFormParams?: IDepositPromoCodeFormCParams,
    clearBtnParams?: IButtonCParams;
};

export interface IDepositPromoCodeFormCParams {
    inputParams?: IInputCParams;
    submitBtnParams?: IButtonCParams;
};

export const defaultParams: IDepositPromoCodeCParams = {
    class: 'wlc-deposit-promocode',
    componentName: 'wlc-deposit-promocode',
    moduleName: 'finances',
    inlineFormParams: {
        inputParams: {
            theme: 'vertical',
            name: 'promocode',
            common: {
                placeholder: gettext('Promo code'),
                useLabel: false,
            },
        },
        submitBtnParams: {
            theme: 'icon',
            common: {
                iconPath: '/wlc/icons/enter-arrow.svg',
            },
        },
    },
    modalFormParams: {
        inputParams: {
            theme: 'vertical',
            name: 'promocode',
            common: {
                placeholder: gettext('Promo code'),
                useLabel: true,
            },
        },
        submitBtnParams: {
            common: {
                text: gettext('Apply'),
            },
        },
    },
    clearBtnParams: {
        theme: 'textonly',
        common: {
            text: 'Cancel',
        },
    },
};
