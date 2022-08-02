import {
    IComponentParams,
    CustomType,
    ITableCol,
} from 'wlc-engine/modules/core';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';
import {
    ProfileMessagePreviewComponent,
} from 'wlc-engine/modules/internal-mails/components/internal-mails/components/mail-preview/mail-preview.component';
import {
    OpenMailBtnComponent,
} from 'wlc-engine/modules/internal-mails/components/internal-mails/components/open-mail-btn/open-mail-btn.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IInternalMailsCParams extends IComponentParams<Theme, Type, ThemeMod> {}

export const defaultParams: IInternalMailsCParams = {
    class: 'wlc-internal-mails',
};

export const internalMailsTableHeadConfig: ITableCol[] = [
    {
        key: 'preview',
        title: '',
        type: 'component',
        componentClass: ProfileMessagePreviewComponent,
        mapValue: (item: InternalMailModel): {internalMail: InternalMailModel} => ({internalMail: item}),
        order: 10,
        wlcElement: 'wlc-profile-table__cell_mail-preview',
    },
    {
        key: 'from',
        title: gettext('From'),
        type: 'text',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_from',
    },
    {
        key: 'title',
        title: gettext('Subject'),
        type: 'text',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_subject',
    },
    {
        key: 'date',
        title: gettext('Date'),
        type: 'component',
        mapValue: (item: InternalMailModel): {internalMail: InternalMailModel} => ({internalMail: item}),
        componentClass: OpenMailBtnComponent,
        order: 40,
        wlcElement: 'wlc-profile-table__cell_date',
    },
];
