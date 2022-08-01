import {Injectable} from '@angular/core';
import {
    IData,
    DataService,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';

interface IBetRequestParams {
    endDate?: string;
    startDate?: string;
}

@Injectable({providedIn: 'root'})
export class BetService {
    constructor(
        protected dataService: DataService,
    ) {
        this.registerMethods();
    }

    public async getBetsList(params: IBetRequestParams = {}): Promise<IBet[]> {
        return (await this.dataService.request<IData>('profile/bets', params)).data;
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'bets',
            system: 'profile',
            url: '/bets',
            type: 'GET',
            events: {
                success: 'BETS',
                fail: 'BETS_ERROR',
            },
        });
    }
}
