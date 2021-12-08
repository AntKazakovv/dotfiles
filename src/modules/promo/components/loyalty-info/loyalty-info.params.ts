import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ILoyaltyInfoCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    imagePath?: string;
    title?: string;
};

export const defaultParams: ILoyaltyInfoCParams = {
    moduleName: 'promo',
    componentName: 'wlc-loyalty-info',
    class: 'wlc-loyalty-info',
    imagePath: '/gstatic/loyalty-info/loyalty-info-bg.jpg',
};
