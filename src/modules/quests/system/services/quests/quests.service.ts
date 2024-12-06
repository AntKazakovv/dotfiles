import {
    inject,
    Injectable,
} from '@angular/core';

import {
    Transition,
    UIRouter,
    RawParams,
} from '@uirouter/core';
import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {
    BehaviorSubject,
    pipe,
    Subscription,
} from 'rxjs';
import {
    takeUntil,
} from 'rxjs/operators';
import _map from 'lodash-es/map';
import _orderBy from 'lodash-es/orderBy';
import _keys from 'lodash-es/keys';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    IIndexing,
    InjectionService,
    IPushMessageParams,
    LogService,
    NotificationEvents,
    WebsocketService,
} from 'wlc-engine/modules/core';
import {
    IQuestsData,
    IQuestsDataModels,
    IQuest,
    IQuestTask,
    QuestModel,
    QuestTaskModel,
    IDataModifier,
    IOrderModifier,
    IGetSubscribeParams,
    IWSQuestData,
    IDataModifiers,
    IQuestNotification,
    QuestTaskStatusEnum,
    IRewardData,
    ITakeRewardData,
} from 'wlc-engine/modules/quests';
import {
    Bonus,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {WebSocketEvents} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';
import {IWSConsumerData} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';

export interface IQueryQuestsParams {
    withModifier? : boolean;
}

@Injectable({
    providedIn: 'root',
})
export class QuestsService {
    protected questsMap: Map<string, QuestModel> = new Map();
    protected questsArray: QuestModel[] = [];
    protected quests$: BehaviorSubject<IQuestsDataModels | null> = new BehaviorSubject(null);
    protected questsDataModifiers: IDataModifier;
    protected dataQuestSub: Subscription;
    protected bonusesService: BonusesService;
    protected dataService: DataService = inject(DataService);
    protected logService: LogService = inject(LogService);
    protected configService: ConfigService = inject(ConfigService);
    protected injectionService: InjectionService = inject(InjectionService);
    protected translateService: TranslateService = inject(TranslateService);
    protected webSocketService: WebsocketService = inject(WebsocketService);
    protected eventService: EventService = inject(EventService);
    protected uiRouter: UIRouter = inject(UIRouter);

    constructor() {
        const language: string = this.translateService.currentLang || 'en';
        QuestModel.currentLang = QuestTaskModel.currentLang = language;
        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent): void => {
            if (QuestModel.currentLang !== lang) {
                QuestModel.currentLang = QuestTaskModel.currentLang = lang;
            }
        });

        if (this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$').getValue()) {
            this.dataQuestSub = this.getQuestsWSCSubscription();
        }

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.dataQuestSub ??= this.getQuestsWSCSubscription();
        });

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            if (this.dataQuestSub) {
                this.dataQuestSub.unsubscribe();
                this.dataQuestSub = null;
            }
        });
    }

    /**
     * Get subscription from quest observer
     *
     * @param {IGetSubscribeParams} params params for subscribtion
     * @returns {Subscription} subsctibtion
     */
    public getSubscription(params: IGetSubscribeParams): Subscription {
        if (params.useQuery) {
            this.queryQuests({withModifier: params.modifyData});
        }

        return this.quests$.pipe(
            (params.pipes || pipe()),
            (params.until) ? takeUntil(params.until) : pipe(),
        ).subscribe(params.observer);
    }

    public async queryQuests({withModifier}: IQueryQuestsParams): Promise<void> {
        withModifier ??= true;

        try {
            if (withModifier && !this.questsDataModifiers) {
                this.questsDataModifiers = this.configService.get('$quests.questsDataModifiers');
            }

            const response: IData<IQuestsData> = await this.dataService.request({
                name: 'quests',
                system: 'loyalty',
                url: '/quests',
                type: 'GET',
            });

            [this.questsArray, this.questsMap] = this.modifyQuestsData(
                response.data.quests,
                this.questsDataModifiers?.quests,
            );

            const tasksMap: Map<string, QuestTaskModel[]> = this.modifyTasksData(
                response.data.tasks,
                this.questsDataModifiers?.tasks,
            );

            this.quests$.next({
                quests: this.questsMap,
                tasks: tasksMap,
            });
        } catch (error) {
            this.logService.sendLog({code: '31.0.0', data: error});
            this.quests$.next(null);
        }
    }

    public async openReward(questId: string): Promise<Bonus> {
        return new Promise(async (resolve, reject): Promise<void> => {
            try {
                const response: IData<IRewardData> = await this.dataService.request({
                    name: 'quests',
                    system: 'loyalty',
                    url: '/quests/openReward',
                    type: 'GET',
                    mapFunc: (data: string) => JSON.parse(data),
                }, {
                    IDQuest: questId,
                });

                if (response.data?.error) {
                    return reject({
                        errors: [response.data.error],
                    });
                }

                if (response.data?.Bonus?.ID) {
                    this.bonusesService ??=
                        await this.injectionService.getService('bonuses.bonuses-service');
                    const bonus: Bonus = await this.bonusesService.getBonus(Number(response.data.Bonus.ID));

                    return resolve(bonus);
                } else {
                    this.logService.sendLog({code: '31.0.1', data: response});

                    return reject({
                        errors: [gettext('Something went wrong')],
                    });
                }
            } catch (error) {
                this.logService.sendLog({code: '31.0.1', data: error});
                return reject(error);
            }
        });
    }

    public async takeReward(questId: string, bonusId: string): Promise<string> {
        return new Promise(async (resolve, reject): Promise<void> => {
            try {
                const response: IData<ITakeRewardData> = await this.dataService.request({
                    name: 'quests',
                    system: 'loyalty',
                    url: '/quests/takeReward',
                    type: 'GET',
                    mapFunc: (data: string) => JSON.parse(data),
                }, {
                    IDQuest: questId,
                    IDBonus: bonusId,
                });

                if (response.data?.error) {
                    return reject({
                        errors: [response.data.error],
                    });
                }

                if (response.data?.BonusTakenAt) {
                    return resolve(response.data.BonusTakenAt);
                } else {
                    this.logService.sendLog({code: '31.0.2', data: response});

                    return reject({
                        errors: [gettext('Something went wrong')],
                    });
                }
            } catch (error) {
                this.logService.sendLog({code: '31.0.2', data: error});
                return reject(error);
            }
        });
    }

    public async getQuestsMap(withModifier?: boolean): Promise<Map<string, QuestModel>> {
        if (!this.questsMap.size) {
            await this.queryQuests({withModifier: withModifier});
        }

        return this.questsMap;
    }

    public async getQuestsArray(withModifier?: boolean): Promise<QuestModel[]> {
        if (!this.questsArray.length) {
            await this.queryQuests({withModifier: withModifier});
        }

        return this.questsArray;
    }

    public async getQuestByState(transition?: Transition): Promise<QuestModel | null> {
        const stateName: string = transition ? transition.targetState().name() : this.uiRouter.globals.current.name;

        if (stateName?.includes('quests')) {
            const stateParams: RawParams = transition
                ? transition.targetState().params()
                : this.uiRouter.globals.params;

            const questId: string = stateParams.questId;

            if (questId) {
                return (await this.getQuestsMap()).get(questId) || null;
            }
        }

        return null;
    }

    protected modifyQuestsData(
        quests: readonly IQuest[],
        modifiers?: IDataModifiers,
    ): [QuestModel[], Map<string, QuestModel>] {
        const questModelsMap: Map<string, QuestModel> = new Map();

        let questModelsArray: QuestModel[] = _map(quests, (quest: IQuest): QuestModel => {
            return new QuestModel(
                {
                    service: 'QuestsService',
                    method: 'modifyQuestsData',
                },
                quest,
            );
        });

        questModelsArray = this.sortItems<QuestModel>(questModelsArray, modifiers);
        questModelsArray.forEach(
            (quest: QuestModel): void => {
                questModelsMap.set(quest.id, quest);
            },
        );

        return [questModelsArray, questModelsMap];
    }

    protected modifyTasksData(
        tasksObject: IIndexing<readonly IQuestTask[]>,
        modifiers?: IDataModifiers,
    ): Map<string, QuestTaskModel[]> {
        const questTasksMap: Map<string, QuestTaskModel[]> = new Map();

        _keys(tasksObject).forEach((questId: string): void => {

            const taskModels: QuestTaskModel[] = tasksObject[questId].filter((questTask: IQuestTask): boolean => {
                return ![QuestTaskStatusEnum.DISABLED, QuestTaskStatusEnum.NOT_USED].includes(questTask.Status);
            }).map((questTask: IQuestTask): QuestTaskModel =>  new QuestTaskModel(
                {
                    service: 'QuestsService',
                    method: 'modifyTasksData',
                },
                questTask,
                questId,
            ));

            questTasksMap.set(
                questId,
                this.sortItems<QuestTaskModel>(taskModels, modifiers),
            );
        });

        return questTasksMap;
    }

    protected sortItems<T>(items: T[], modifiers?: IDataModifiers): T[] {

        if (modifiers?.orders?.length && items?.length) {
            items = _orderBy(
                items,
                _map(modifiers.orders, (modifier: IOrderModifier) => modifier.iterator),
                _map(modifiers.orders, (modifier: IOrderModifier) => modifier.order ?? 'desc'),
            ) as T[];
        }

        return items;
    }

    protected getQuestsWSCSubscription(): Subscription {
        return this.webSocketService.getMessages({
            endPoint: 'wsc2',
            events: [WebSocketEvents.RECEIVE.QUESTS],
        }).subscribe({
            next: (message: IWSConsumerData<IWSQuestData>): void => {
                if (!message?.data) {
                    return;
                }

                const questNotificationConfig: IQuestNotification = this.configService.get('$quests.notification');
                const questName: string = JSON.parse(message.data.quest_name);
                const questImage: string = message.data.image;
                const translatedQuestName: string = questName[(this.translateService.currentLang)]?.length
                    ? questName[(this.translateService.currentLang)]
                    : questName[('en')];

                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: {
                        icon: {
                            src: questImage || questNotificationConfig?.fallbackIcon,
                            fallback: questNotificationConfig?.fallbackIcon,
                            alt: questName,
                        },
                        title: questNotificationConfig?.questTitle,
                        message: questNotificationConfig?.questMessage,
                        messageContext: {
                            questname: translatedQuestName,
                        },
                    } as IPushMessageParams,
                });
            },
        });
    }
}
