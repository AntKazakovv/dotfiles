import {
    inject,
    Injectable,
} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import _map from 'lodash-es/map';
import _isObject from 'lodash-es/isObject';
import _values from 'lodash-es/values';
import _toNumber from 'lodash-es/toNumber';

import {
    DataService,
    LogService,
    IData,
    ConfigService,
} from 'wlc-engine/modules/core';
import {ILevel} from 'wlc-engine/modules/loyalty/system/interfaces';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models';

@Injectable({
    providedIn: 'root',
})
export class LoyaltyLevelsService {
    public readonly levels$: BehaviorSubject<LoyaltyLevelModel[] | null> = new BehaviorSubject(null);

    protected logService: LogService = inject(LogService);
    protected configService: ConfigService = inject(ConfigService);
    protected dataService: DataService = inject(DataService);
    protected translateService: TranslateService = inject(TranslateService);

    constructor() {
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

            if (_isObject(response.data)) {
                response.data = _values(response.data);
            }

            return this.modifyLevels(response.data);
        } catch (error) {
            this.logService.sendLog({code: '16.0.0', data: error});
            return Promise.reject(error);
        }
    }

    /**
     * get loyalty levels or return empty array on error in request
     */
    public getLoyaltyLevelsObserver(): BehaviorSubject<LoyaltyLevelModel[]> {
        this.getLoyaltyLevels()
            .then((levels: LoyaltyLevelModel[]): void => {
                this.levels$.next(levels);
            }).catch((): void => {
                this.levels$.next([]);
            });


        return this.levels$;
    }

    /**
     * Get loyalty level icon by level
     */
    public getLevelIcon(level: number): string {
        const imagesDirPath = this.configService.get<string>('$loyalty.loyalty.iconsDirPath');
        const imageExtension = this.configService.get<string>('$loyalty.loyalty.iconsExtension');
        return `${imagesDirPath}/${level}.${imageExtension}`;
    }

    /**
     * Get loyalty level fallback icon
     */
    public getLevelIconFallback(): string {
        return this.configService.get<string>('$loyalty.loyalty.iconFallback');
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
     * Calculated CurrentLevelPoints property
     *
     * @returns {LoyaltyLevelModel[]} array of loyalty levels
     *
     */
    private modifyLevels(data: ILevel[]): LoyaltyLevelModel[] {
        return _map(data, (level: ILevel, index: number): LoyaltyLevelModel => {

            if (index && _toNumber(data[index - 1].NextLevelPoints)) {
                level.CurrentLevelPoints = data[index - 1].NextLevelPoints;
            } else {
                level.CurrentLevelPoints = '0';
            }

            const isLastLevel: boolean = (data.length - 1) === index;

            return new LoyaltyLevelModel(
                {service: 'LoyaltyLevelsService', method: 'modifyLevels'},
                level,
                isLastLevel,
                this.translateService,
            );
        });
    }
}
