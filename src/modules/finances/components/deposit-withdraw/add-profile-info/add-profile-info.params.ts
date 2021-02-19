import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'overflow' | CustomType;

export interface IAddProfileInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    formConfig: IFormWrapperCParams;
};

export const defaultParams: Partial<IAddProfileInfoCParams> = {
    class: 'wlc-add-profile-info',
};
