import {Injectable} from '@angular/core';

import {
    DataService,
    EventService,
    NotificationEvents,
    IPushMessageParams,
    IData,
    IIndexing,
} from 'wlc-engine/modules/core';

export interface IKycamlData {
    url: string;
    service: 'SumSub' | 'ShuftiPro';
    status: string;
}

export const statusDesc: IIndexing<string> = {
    uncommitted: gettext('Verification is not passed yet'),
    processing: gettext('The documents are being processed'),
    completed: gettext('The documents have been verified successfully'),
    failed: gettext('Verification has been declined'),
    retry: gettext('Verification has been declined. Please try again'),
    deleted: gettext('Time for uploading documents has expired'),
};

@Injectable({
    providedIn: 'root',
})
export class ShuftiProKycamlService {

    constructor(
        private dataService: DataService,
        private eventService: EventService,
    ) {}

    public async getKycamlData(): Promise<IKycamlData> {

        const res = await this.getData();

        if (!res) {
            return;
        }

        const {service, url, status} = res;

        return {
            service,
            url,
            status,
        };
    }

    public async getData(): Promise<IKycamlData> {
        return (await this.dataService.request<IData<IKycamlData>>({
            name: 'kycamlGet',
            system: 'verification',
            url: '/kycaml',
            type: 'GET',
        }))?.data;
    }

    public async createData(): Promise<IKycamlData> {
        try {
            const res = await this.dataService.request<IData<IKycamlData>>({
                name: 'kycamlGet',
                system: 'verification',
                url: '/kycaml',
                type: 'POST',
            });

            return res?.data;
        } catch {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: gettext('The service is temporarily unavailable.' +
                     ' Please, try again later or contact the technical support service'),
                },
            });
        }
    }
}
