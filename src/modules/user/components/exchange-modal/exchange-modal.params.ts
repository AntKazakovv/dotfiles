import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IExchangeCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: IExchangeCParams = {
    class: 'wlc-exchange',
};
