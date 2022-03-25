import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IInputCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IFieldComponentParams {
    /**
     * Form components params
     */
    params: IInputCParams | ISelectCParams;
}

export interface IProfileBlocksCParams extends IComponentParams<Theme, Type, ThemeMod> {
}

export const defaultParams: IProfileBlocksCParams = {
    class: 'wlc-profile-blocks',
    componentName: 'wlc-profile-blocks',
    moduleName: 'user',
};
