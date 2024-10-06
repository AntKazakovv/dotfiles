import {CustomType, IFormWrapperCParams, IWrapperCParams} from 'wlc-engine/modules/core';
import {IAbstractSignInFormCParams} from 'wlc-engine/modules/core/system/classes/sign-in-form-abstract.class';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISignInFormCParams extends IAbstractSignInFormCParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
    };
    wrapperConfig?: IWrapperCParams;
    modifiers?: Modifiers[];
    formConfig?: IFormWrapperCParams;
}
