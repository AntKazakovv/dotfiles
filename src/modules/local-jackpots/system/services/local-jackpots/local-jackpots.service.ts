import {Injectable} from '@angular/core';

import {
    DataService,
    IData,
    LogService,
} from 'wlc-engine/modules/core';
import {ILocalJackpot} from 'wlc-engine/modules/local-jackpots/system/interfaces/local-jackpots.interface';

interface ILocalJackpotsData {
    data: ILocalJackpot[];
    status: string;
}

@Injectable({
    providedIn: 'root',
})
export class LocalJackpotsService {

    constructor(
        private dataService: DataService,
        private logService: LogService,
    ) {
        this.init();
    }

    public async getJackpots(userCurrency: string): Promise<ILocalJackpot[]> {
        try {
            return (await this.dataService.request<IData<ILocalJackpotsData>>('promo/jackpots', {
                currency: userCurrency,
            })).data?.data;
        } catch (error) {
            this.logService.sendLog({code: '30.0.0', data: error});
        }
    }

    private init(): void {
        this.registerMethod();
    }

    private registerMethod(): void {
        this.dataService.registerMethod({
            name: 'jackpots',
            system: 'promo',
            url: '/appearance/jackpots',
            type: 'GET',
            apiVersion: 2,
        });
    }
}
