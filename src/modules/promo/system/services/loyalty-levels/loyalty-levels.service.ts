import {Injectable} from '@angular/core';
import {DataService, IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ILevel} from 'wlc-engine/modules/promo/system/interfaces/level.interface';
import {LoyaltyLevelModel} from 'wlc-engine/modules/promo/system/models/loyalty-level.model';

import _map from 'lodash-es/map';

@Injectable({
    providedIn: 'root',
})
export class LoyaltyLevelsService {
    public levels: IIndexing<string>[] = [];

    constructor(
        private dataService: DataService,
    ) {
        this.registerMethods();
    }

    /**
     * Get loyalty levels data
     *
     * @returns {LoyaltyLevelModel[]} array of loyalty levels
     *
     */
    public async getLoyaltyLevels(): Promise<LoyaltyLevelModel[]> {
        try {
            const response: IData = await this.dataService.request('loyalty/levels');
            return this.modifyLevels(response.data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'levels',
            system: 'loyalty',
            url: '/loyalty/levels',
            type: 'GET',
            cache: 10 * 60 * 1000, // 10 minutes
        });
    }

    /**
     * Prepares loyalty levels from back-end data
     *
     * @returns {LoyaltyLevelModel[]} array of loyalty levels
     *
     */
    private modifyLevels(data: ILevel[]): LoyaltyLevelModel[] {
        if (!data) {
            return;
        }

        return _map(data, level => new LoyaltyLevelModel(
            {service: 'LoyaltyLevelsService', method: 'modifyLevels'},
            level,
        ));
    }
}
