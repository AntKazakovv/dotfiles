import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IOpenMailMessageBtn extends IComponentParams<Theme, Type, ThemeMod> {
    internalMail: InternalMailModel;
    buttonParams?: IButtonCParams;
}

export const defaultParams: Partial<IOpenMailMessageBtn> = {
    class: 'wlc-open-mail-btn',
    buttonParams: {
        common: {
            text: gettext('Read more'),
            typeAttr: 'button',
        },
    },
};
