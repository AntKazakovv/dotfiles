import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IEnterPromocodeParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        title?: string,
    };
}

export const defaultParams: IEnterPromocodeParams = {
    moduleName: 'bonuses',
    class: 'wlc-enter-promocode',
    common: {
        title: gettext('Have a promo code?'),
    },
};
