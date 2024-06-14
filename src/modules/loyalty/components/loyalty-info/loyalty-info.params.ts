import {GlobalHelper} from 'wlc-engine/modules/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    imagePath?: string;
    title?: string;
}

export const defaultParams: ILoyaltyInfoCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-info',
    class: 'wlc-loyalty-info',
    imagePath: GlobalHelper.gstaticUrl + '/loyalty-info/loyalty-info-bg.jpg',
};
