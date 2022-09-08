import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IStoreItemInfoCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Text for title */
    title: string,
    /** Store item description */
    description: string,
    /** Use alert or not */
    isDisabled: boolean,
}

export const defaultParams: Partial<IStoreItemInfoCParams> = {
    moduleName: 'store',
    componentName: 'wlc-store-item-info',
    class: 'wlc-store-item-info',
    title: '',
    description: '',
    isDisabled: false,
};
