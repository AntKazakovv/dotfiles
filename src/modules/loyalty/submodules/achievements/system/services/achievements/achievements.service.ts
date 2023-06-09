import {Injectable} from '@angular/core';
import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';

import _each from 'lodash-es/each';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import _map from 'lodash-es/map';
import _reject from 'lodash-es/reject';

import {
    DataService,
    IData,
    LogService,
} from 'wlc-engine/modules/core';
import {
    IAchievement,
    IModifier,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';
import {AchievementModel} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models/achievement.model';

@Injectable({
    providedIn: 'root',
})
export class AchievementsService {

    constructor(
        protected dataService: DataService,
        protected logService: LogService,
        protected translateService: TranslateService,
    ){
        this.init();
    }

    public async getAchievements(modifier?: IModifier): Promise<AchievementModel[]> {
        try {
            const response: IData = await this.dataService.request({
                name: 'achievements',
                system: 'loyalty',
                url: '/achievements',
                type: 'GET',
            });
            let achievements = this.modifyData(response.data);
            if (achievements.length && modifier) {
                achievements = this.modifyAchievementArray(achievements, modifier);
            }
            return achievements;
        } catch (error) {
            this.logService.sendLog({code: '16.0.1', data: error});
        }
    }

    protected init(): void {
        AchievementModel.currentLang = this.translateService.currentLang || 'en';
        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (AchievementModel.currentLang !== lang) {
                AchievementModel.currentLang = lang;
            }
        });
    }

    protected modifyData(data: IAchievement[]): AchievementModel[] {
        if (data) {
            return _map(data, item => new AchievementModel(
                {
                    service: 'AchievementsService',
                    method: 'modifyData',
                },
                item,
            ));
        }
    }

    protected modifyAchievementArray (achievements: AchievementModel[], modifier: IModifier): AchievementModel[] {
        if (modifier.type === 'order') {
            return this.orderAchievementArray(achievements, modifier);
        } else {
            return achievements;
        }
    }

    protected orderAchievementArray (achievements: AchievementModel[], modifier: IModifier): AchievementModel[] {
        if (modifier.field && modifier.values?.length) {
            let result: AchievementModel[] = [];
            let set: AchievementModel[];

            _each(modifier.values, (value): void => {
                set = _filter(achievements, (achievement: AchievementModel): boolean => {
                    return achievement[modifier.field] === value;
                });
                result.push(...set);
            });

            if (result.length !== achievements.length) {
                set = _reject(achievements, (achievement: AchievementModel): boolean => {
                    return _includes(modifier.values, achievement[modifier.field]);
                });
                result.push(...set);
            }

            return result;
        } else {
            return achievements;
        }
    }
}
