import {IButtonCParams, IInputCParams} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'modal' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IDepositPromoCodeCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    inputParams?: IInputCParams;

    submitBtnParams?: IButtonCParams;
    clearBtnParams?: IButtonCParams;
};

export const defaultParams: IDepositPromoCodeCParams = {
    class: 'wlc-deposit-promocode',
    componentName: 'wlc-deposit-promocode',
    moduleName: 'finances',
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
    clearBtnParams: {
        theme: 'textonly',
        common: {
            text: 'Cancel',
        },
    },
};
