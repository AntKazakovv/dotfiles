import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | 'wolf' | 'mobile-app' |  CustomType;
export type Type = 'default' | CustomType;

export interface IEnterPromocodeCParams extends IComponentParams<Theme, Type, string> {
    common?: {
        title?: string,
        showTitle?: boolean,
        description?: string,
        showDescription: boolean,
        placeholder: string,
        btnIconPath: string,
        signupModalName: string,
    };
}

export const defaultParams: IEnterPromocodeCParams = {
    moduleName: 'bonuses',
    class: 'wlc-enter-promocode',
    componentName: 'wlc-enter-promocode',
    common: {
        showTitle: true,
        title: gettext('Have a promo code?'),
        showDescription: false,
        placeholder: gettext('Enter promo code'),
        btnIconPath: '/wlc/icons/enter-arrow.svg',
        signupModalName: 'signup',
    },
};
