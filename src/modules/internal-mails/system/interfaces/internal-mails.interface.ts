import {IIndexing} from 'wlc-engine/modules/core';

export type TInternaiMailStatus = 'new' | 'readed';

export const messagesFilterStatus = {
    'readed': 1,
    'new': 0,
};

export interface IInternalMail {
    /**
     * Mail's message
     */
    Content: string | IIndexing<string>;
    /**
     * Date of creation of the mail in string format
     */
    Created: string;
    ID: string;
    IsEvent: '0' | '1';
    /**
     * Title of the mail
     */
    Name: string | IIndexing<string>;
    /**
     * Personal mail ('1') or general/group mailing / ('0')
     */
    Personal: '0' | '1';
    /**
     * Has the mail been read
     */
    Status: TInternaiMailStatus;
}

export interface IMailNotificationsParams {
    enableNotification?: boolean;
    excludedStatesForNotifications?: string[];
    numberOfNotifications?: number,
}

export interface IMessagesRequestParams {
    dateTo?: string;
    dateFrom?: string;
    page?: number;
    limit?: number;
    status?: number;
}
