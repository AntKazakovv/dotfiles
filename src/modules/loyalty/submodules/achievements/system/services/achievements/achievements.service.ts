import {Injectable} from '@angular/core';

import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {
    RawParams,
    Transition,
    UIRouter,
} from '@uirouter/core';
import {Subscription} from 'rxjs';
import _each from 'lodash-es/each';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import _map from 'lodash-es/map';
import _reject from 'lodash-es/reject';
import _toNumber from 'lodash-es/toNumber';
import _find from 'lodash-es/find';
import _orderBy from 'lodash-es/orderBy';

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
    IAchievementGroup,
    IModifier,
    IWSAchievementData,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';
import {WebSocketEvents} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';
import {
    AchievementModel,
    AchievementGroupModel,
} from 'wlc-engine/modules/loyalty/submodules/achievements';
import {IWSConsumerData} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';

@Injectable({
    providedIn: 'root',
})
export class AchievementsService {
    private dataAchievementSub: Subscription;
    private _groups: AchievementGroupModel[] = [];

    constructor(
        protected dataService: DataService,
        protected logService: LogService,
        protected translateService: TranslateService,
        private webSocketService: WebsocketService,
        private eventService: EventService,
        private uiRouter: UIRouter,
    ) {
        this.init();
    }

    public async getAchievements(): Promise<AchievementModel[]> {
        try {
            const response: IData = await this.dataService.request({
                name: 'achievements',
                system: 'loyalty',
                url: '/achievements',
                type: 'GET',
            }, {
                groups: true,
            });

            let achievements: AchievementModel[] = this.modifyData(response.data.achievements);

            this._groups = this.modifyGroupsData(response.data.groups);

            return achievements;
        } catch (error) {
            this.logService.sendLog({code: '16.0.1', data: error});
        }
    }

    public async getGroups(): Promise<AchievementGroupModel[]> {
        if (!this._groups.length) {
            await this.getAchievements();
        }

        return this._groups;
    }

    /**
     * Get achievement group by state
     *
     * @returns {StoreCategory} Store category
     */
    public getGroupByState(transition?: Transition): AchievementGroupModel | null {
        const stateName: string = transition ? transition.targetState().name() : this.uiRouter.globals.current.name;

        if (!_includes(stateName, 'achievements')) {
            return null;
        }

        const stateParams: RawParams = transition ? transition.targetState().params() : this.uiRouter.globals.params;
        const groupId: number = _toNumber(stateParams?.['group']) || _toNumber(AchievementGroupModel.commonGroupId);

        return _find(
            (this._groups.length ? this._groups : this.modifyGroupsData([])),
            (group: AchievementGroupModel) => group.id === groupId,
        );
    }

    // MADE FOR CATS #548321
    public getAchievementGroupById(id: number): AchievementGroupModel {
        return _find(this._groups, (group) => id === group.id);
    }

    public setAchievementsSubscription(): void {
        this.dataAchievementSub = this.webSocketService.getMessages({
            endPoint: 'wsc2', events: [WebSocketEvents.RECEIVE.ACHIEVEMENTS],
        }).subscribe(
            {
                next: (message: IWSConsumerData<IWSAchievementData>) => {
                    const achName = JSON.parse(message.data.achievement_name);

                    this.eventService.emit({
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'success',
                            title: gettext('Achievement received'),
                            message: achName[(this.translateService.currentLang)]?.length
                                ? achName[(this.translateService.currentLang)]
                                : achName[('en')],
                        },
                    });
                },
            },
        );
    }

    public modifyAchievementArray(achievements: AchievementModel[], modifier: IModifier): AchievementModel[] {
        if (modifier.type === 'order') {
            return this.orderAchievementArray(achievements, modifier);
        } else {
            return achievements;
        }
    }

    protected init(): void {
        AchievementModel.currentLang = this.translateService.currentLang || 'en';
        AchievementGroupModel.currentLang = this.translateService.currentLang || 'en';
        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (AchievementModel.currentLang !== lang) {
                AchievementModel.currentLang = lang;
            }

            if (AchievementGroupModel.currentLang !== lang) {
                AchievementGroupModel.currentLang = lang;
            }
        });

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.dataAchievementSub.unsubscribe();
        });
    }

    protected modifyData(data: IAchievement[]): AchievementModel[] {
        return _map(data, item => new AchievementModel(
            {
                service: 'AchievementsService',
                method: 'modifyData',
            },
            item,
        ));
    }

    protected modifyGroupsData(data: IAchievementGroup[]): AchievementGroupModel[] {
        const commonGroup: IAchievementGroup = {
            ID: AchievementGroupModel.commonGroupId,
            Name: {
                en: gettext('All achievements'),
            },
            Weight: '999999',
        };

        const sortedData: IAchievementGroup[] = _orderBy(
            [commonGroup, ...(data || [])],
            (el) => _toNumber(el.Weight),
            'desc',
        );

        return _map(sortedData, (item: IAchievementGroup) => new AchievementGroupModel(
            {
                service: 'AchievementsService',
                method: 'modifyData',
            },
            item,
        ));
    }

    protected orderAchievementArray(achievements: AchievementModel[], modifier: IModifier): AchievementModel[] {
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
