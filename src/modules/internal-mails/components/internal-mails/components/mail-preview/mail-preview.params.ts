import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IMailPreviewCParams extends IComponentParams<Theme, Type, ThemeMod> {
    internalMail: InternalMailModel;
}

export const defaultParams: Partial<IMailPreviewCParams> = {
    class: 'wlc-mail-preview',
};
