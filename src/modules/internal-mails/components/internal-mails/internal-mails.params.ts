import {
    IComponentParams,
    CustomType,
    ITableCol,
    IWrapperCParams,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';
import {
    ProfileMessagePreviewComponent,
} from 'wlc-engine/modules/internal-mails/components/internal-mails/components/mail-preview/mail-preview.component';
import {
    OpenMailBtnComponent,
} from 'wlc-engine/modules/internal-mails/components/internal-mails/components/open-mail-btn/open-mail-btn.component';
import {
    MailActionsDropdownComponent,
// import path
// eslint-disable-next-line max-len
} from 'wlc-engine/modules/internal-mails/components/internal-mails/components/mail-actions-dropdown/mail-actions-dropdown.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IMailHistoryRangeParams {
    type: string,
    historyType: string,
}

export interface IInternalMailsCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    historyRangeParams?: IMailHistoryRangeParams;
    tableConfig?: ITableCParams;
}

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
    {
        key: 'mail-actions',
        title: '',
        type: 'component',
        componentClass: MailActionsDropdownComponent,
        mapValue: (item: InternalMailModel): {internalMail: InternalMailModel} => ({internalMail: item}),
        order: 50,
        wlcElement: 'wlc-profile-table__cell_actions',
    },
];

export const defaultParams: IInternalMailsCParams = {
    moduleName: 'internal-mails',
    componentName: 'wlc-internal-mails',
    class: 'wlc-internal-mails',
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No messages'),
                },
            },
        ],
    },
    historyRangeParams: {
        type: 'submenu',
        historyType: 'mails',
    },
    tableConfig: {
        head: internalMailsTableHeadConfig,
        pageCount: 10,
        pagination: {
            use: true,
            breakpoints: null,
            total: 0,
        },
    },
};
