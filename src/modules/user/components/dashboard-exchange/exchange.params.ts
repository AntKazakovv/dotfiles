import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IDashboardExchangeCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: IDashboardExchangeCParams = {
    class: 'wlc-exchange',
};
