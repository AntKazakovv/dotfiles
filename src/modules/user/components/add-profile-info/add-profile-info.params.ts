import {BehaviorSubject} from 'rxjs';
import {
    RawParams,
    StateOrName,
} from '@uirouter/core';

import {
    IComponentParams,
    CustomType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {IFormWrapperCParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'overflow' | CustomType;

export interface IAddProfileInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    title?: string;
    formConfig: IFormWrapperCParams;
    formData?: BehaviorSubject<IIndexing<any>>;
    /* redirection when the modal window is filled correctly */
    redirect?: {
        success?: {
            to: StateOrName;
            params?: RawParams;
        };
    };
}

export const defaultParams: Partial<IAddProfileInfoCParams> = {
    class: 'wlc-add-profile-info',
    title: gettext('Add info'),
};
