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

import {Subscription} from 'rxjs';

import {
    DataService,
    EventService,
    IData,
    IPushMessageParams,
    LogService,
    WebsocketService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    IAchievement,
    IModifier,
    IWSAchievement,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';
import {WebSocketEvents} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';
import {AchievementModel} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models/achievement.model';

@Injectable({
    providedIn: 'root',
})
export class AchievementsService {
    private dataAchievementSub: Subscription;
    constructor(
        protected dataService: DataService,
        protected logService: LogService,
        protected translateService: TranslateService,
        private webSocketService: WebsocketService,
        private eventService: EventService,
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

    public setAchievementsSubscription(): void {
        this.dataAchievementSub = this.webSocketService.getMessages(
            {endPoint:'wsc2', events: [WebSocketEvents.RECEIVE.ACHIEVEMENTS]}).subscribe(
            {
                next: (message: IWSAchievement) => {
                    const achName = JSON.parse(message.data.achievement_name);

                    this.eventService.emit({
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'success',
                            title: gettext('Achievement received'),
                            message: achName[(this.translateService.currentLang || 'en')],
                        },
                    });
                },
            },
        );
    }

    protected init(): void {
        AchievementModel.currentLang = this.translateService.currentLang || 'en';
        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (AchievementModel.currentLang !== lang) {
                AchievementModel.currentLang = lang;
            }
        });

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.dataAchievementSub.unsubscribe();
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
