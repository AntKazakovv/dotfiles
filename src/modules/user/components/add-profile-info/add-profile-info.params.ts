import {
    IComponentParams,
    CustomType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {IFormWrapperCParams} from 'wlc-engine/modules/core';
import {BehaviorSubject} from 'rxjs';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'overflow' | CustomType;

export interface IAddProfileInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    title?: string;
    formConfig: IFormWrapperCParams;
    formData?: BehaviorSubject<IIndexing<any>>;
};

export const defaultParams: Partial<IAddProfileInfoCParams> = {
    class: 'wlc-add-profile-info',
    title: gettext('Add info'),
};
