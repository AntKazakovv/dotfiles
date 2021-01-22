import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IEnterPromocodeParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        titleText?: string,
    };
}

export const defaultParams: IEnterPromocodeParams = {
    moduleName: 'bonuses',
    class: 'wlc-enter-promocode',
    common: {
        titleText: gettext('Have a promo code?'),
    },
};
