import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IPagination,
} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'first' | CustomType;

export interface ICashbackRewardCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    pagination?: IPagination;
}

export const defaultParams: ICashbackRewardCParams = {
    moduleName: 'cashback',
    componentName: 'wlc-cashback-rewards',
    class: 'wlc-cashback',
};
