import {Injectable} from '@angular/core';

import {
    DataService,
    IData,
} from 'wlc-engine/modules/core';

export interface IKycamlData {
    url: string;
    service: 'SumSub' | 'ShuftiPro';
}

@Injectable()
export class ShuftiProKycamlService {

    constructor(
        private dataService: DataService,
    ) {}

    public async getKycamlData(): Promise<IKycamlData> {

        const res = await this.getData();

        const system = res?.service;
        const url = res?.url || (await this.createData()).url;

        if (!url) {
            throw new Error('Iframe url was not received');
        }

        return {
            service: system,
            url: url,
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
        return (await this.dataService.request<IData<IKycamlData>>({
            name: 'kycamlGet',
            system: 'verification',
            url: '/kycaml',
            type: 'POST',
        }))?.data;
    }
}
