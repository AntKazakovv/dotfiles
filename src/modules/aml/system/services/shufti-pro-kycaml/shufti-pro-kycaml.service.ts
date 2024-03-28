import {Injectable} from '@angular/core';

import {
    DataService,
    EventService,
    NotificationEvents,
    IPushMessageParams,
    IData,
    LogService,
} from 'wlc-engine/modules/core';

import {
    IKycamlData,
    TDocsMode,
    IUserDoc,
} from 'wlc-engine/modules/aml/system/interfaces/kyc-aml.interface';

interface IDepositsSumData {
    Deposit: number,
};

@Injectable({
    providedIn: 'root',
})
export class ShuftiProKycamlService {

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private logService: LogService,
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

    public async getDocs(mode: TDocsMode): Promise<IData> {
        try {
            const res: IData<IUserDoc[]> = await this.dataService.request({
                name: 'docsMode',
                system: 'kyc',
                url: '/docs/mode',
                type: 'GET',
            }, {mode});
            return res;
        } catch (error) {
            this.logService.sendLog({code: '25.0.2', data: error});
        }
    }

    public async sumDeposits(): Promise<number> {
        try {
            const res: IData<IDepositsSumData> = await this.dataService.request({
                name: 'sumDeposits',
                system: 'kyc',
                url: '/sumDeposits',
                type: 'GET',
            });
            return res.data.Deposit;
        } catch (error) {
            this.logService.sendLog({code: '25.0.3', data: error});
        }
    }
}
