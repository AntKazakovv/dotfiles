import {Injectable} from '@angular/core';
import {timer} from 'rxjs';
import {
    IData,
    DataService,
    EventService,
    LogService,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';

import _concat from 'lodash-es/concat';

export interface ISmsSendResponse {
    status?: boolean;
    token?: string;
}

export interface ISmsStateResponse {
    status?: boolean;
    state?: string;
}

@Injectable({
    providedIn: 'root',
})
export class SmsService {

    private messageTitle: string = gettext('SMS verification');
    private checkStateCounter: number = 0;

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private logService: LogService,
    ) {
        this.registerMethods();
    }

    /**
     * Sends SMS code
     *
     * @param {string} phoneCode phone code
     * @param {string} phoneNumber phone number
     *
     * @return {Promise} response server response
     */
    public async send(phoneCode: string, phoneNumber: string): Promise<ISmsSendResponse> {
        const params = {phoneCode, phoneNumber};
        const textData = [gettext('Error occurred while sending code for SMS Verification')];
        try {
            const response: IData = await this.dataService.request('sms/send', params);
            return response.data;
        } catch(error) {
            this.showError(_concat(textData, error.errors));
            this.logService.sendLog({code: '15.0.0', data: error});
        }
    }

    /**
     * Validate SMS code
     *
     * @param {string} token SMS token
     * @param {string} smsCode SMS code
     * @param {string} phoneCode phone code
     * @param {string} phoneNumber phone number
     *
     * @return {Promise} response server response
     */
    public async validate(token: string, smsCode: string, phoneCode: string, phoneNumber: string): Promise<ISmsSendResponse> {
        const params = {token, smsCode, phoneCode, phoneNumber};
        const textData = [gettext('The code you entered is incorrect')];
        try {
            const response: IData = await this.dataService.request('sms/validate', params);
            return response.data;
        } catch(error) {
            this.showError(textData);
            this.logService.sendLog({code: '15.0.1', data: error});
        }
    }

    /**
     * Get sms state
     *
     * @param {string} token SMS token
     *
     * @return {Promise} response server response
     */
    public async state(token: string): Promise<ISmsStateResponse> {
        try {
            const response: IData = await this.dataService.request('sms/state', {token: token});
            return response.data;
        } catch(error) {
            this.logService.sendLog({code: '15.0.2', data: error});
        }
    }

    /**
     * Check sms state
     *
     * @param {string} token SMS token
     * @param {number} timeout check SMS status timeout value
     *
     * @return {Promise} boolean
     */
    public async checkState(token: string, timeout: number = 5000): Promise<boolean> {
        try {
            const response = await this.state(token);
            if (['Unknown', 'Sent', 'Failed', 'Delivered', 'Canceled'].indexOf(response.state) === -1) {
                this.checkStateCounter ++;
                if (this.checkStateCounter > 2) {
                    this.checkStateCounter = 0;
                    return false;
                }
                timer(timeout).subscribe(() =>  this.checkState(token, timeout));
            } else {
                this.checkStateCounter = 0;
                return true;
            }
        } catch(error) {
            return false;
        }
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'send',
            system: 'sms',
            url: '/sms',
            type: 'POST',
            events: {
                success: 'SMS_SENDING_SUCCEEDED',
                fail: 'SMS_SENDING_FAILED',
            },
        });

        this.dataService.registerMethod({
            name: 'state',
            system: 'sms',
            url: '/sms',
            type: 'PATCH',
        });

        this.dataService.registerMethod({
            name: 'validate',
            system: 'sms',
            url: '/sms',
            type: 'PUT',
            events: {
                success: 'SMS_VALIDATION_SUCCEEDED',
                fail: 'SMS_VALIDATION_FAILED',
            },
        });
    }

    private showError(errors: string[], title: string = this.messageTitle): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message: errors,
                wlcElement: 'sms-error',
            },
        });
    }
}
