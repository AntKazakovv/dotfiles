import {Injectable} from '@angular/core';

import _map from 'lodash-es/map';

import {
    DataService,
    LogService,
    IData,
    IIndexing,
} from 'wlc-engine/modules/core';
import {ILevel} from 'wlc-engine/modules/loyalty/system/interfaces';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models';

@Injectable({
    providedIn: 'root',
})
export class LoyaltyLevelsService {
    public levels: IIndexing<string>[] = [];

    constructor(
        protected logService: LogService,
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
            this.logService.sendLog({code: '16.0.0', data: error});
            return Promise.reject(error);
        }
    }

    /**
     * get loyalty levels or return empty array on error in request
     */
    public async getLoyaltyLevelsSafely(): Promise<LoyaltyLevelModel[]> {
        try {
            return await this.getLoyaltyLevels();
        } catch (error) {
            return [];
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
