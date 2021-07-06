import {HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

export interface IEmailParams {
    senderName: string,
    senderEmail: string,
    subject: string,
    message: string,
}

@Injectable({
    providedIn: 'root',
})
export class ContactsService {

    constructor(
        protected data: DataService,
    ) {}

    /**
     * Send data to contacts api supportMail
     *
     * @example
     *
     * const params = {
     *  senderName: 'Test Sender',
     *  senderEmail: 'test@sender.com',
     *  subject: 'Email subject',
     *  message: 'This is email message'
     * }
     *
     * this.contactsService.get(params).then(result => {
     *  alert(result);
     * });
     *
     */
    public send(params: IEmailParams): Promise<IData> {
        return this.data.request({
            name: 'supportEmail',
            system: 'supportEmail',
            url: '/supportEmail',
            type: 'POST',
        }, params);
    }
}
