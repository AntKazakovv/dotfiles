import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | 'menu' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IInternalMailsNotifierCParams extends IComponentParams<Theme, Type, ThemeMod> {}

export const defaultParams: IInternalMailsNotifierCParams = {
    class: 'wlc-internal-mails-notifier',
};

