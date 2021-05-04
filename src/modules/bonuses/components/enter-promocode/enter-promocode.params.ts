import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IEnterPromocodeCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        title?: string,
        showTitle?: boolean,
    };
}

export const defaultParams: IEnterPromocodeCParams = {
    moduleName: 'bonuses',
    class: 'wlc-enter-promocode',
    componentName: 'wlc-enter-promocode',
    common: {
        showTitle: true,
        title: gettext('Have a promo code?'),
    },
};
