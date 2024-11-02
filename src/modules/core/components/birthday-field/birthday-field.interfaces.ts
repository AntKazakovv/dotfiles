import {
    CustomType,
    IComponentParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';
export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBirthFields {
    birthDay: ISelectCParams;
    birthMonth: ISelectCParams;
    birthYear: ISelectCParams;
}

export interface IBirthFieldCParams extends IComponentParams<ComponentTheme, ComponentType, string>, IBirthFields {}

export interface IFieldsValue {
    /**
     * names of controls
     */
    field: keyof IBirthFields;
    /**
     * controls value type
     */
    value: string;
}
