import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IMailActionsDropdownCParams extends IComponentParams<Theme, Type, ThemeMod> {
    internalMail?: InternalMailModel;
};

export const defaultParams: IMailActionsDropdownCParams = {
    class: 'wlc-mail-actions-dropdown',
};