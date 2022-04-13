import {IIndexing} from 'wlc-engine/modules/core';

export type TInternaiMailStatus = 'new' | 'readed';

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
