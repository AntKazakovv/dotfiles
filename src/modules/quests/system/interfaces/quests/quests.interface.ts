import {
    Observable,
    OperatorFunction,
    PartialObserver,
} from 'rxjs';

import {
    IIndexing,
    TSortDirection,
} from 'wlc-engine/modules/core';
import {
    QuestModel,
    QuestTaskModel,
} from 'wlc-engine/modules/quests';
import {
    IBonus,
} from 'wlc-engine/modules/bonuses';

export interface IQuestsData {
    quests: readonly IQuest[];
    tasks: IIndexing<readonly IQuestTask[]>;
}

export interface IQuestsDataModels {
    quests: Map<string, QuestModel>;
    tasks: Map<string, QuestTaskModel[]>;
}

export interface IQuest {
    ID: number;
    IDBonus: number;
    LQID: string;
    Name: IIndexing<string>;
    Progress: IQuestProgress;
    RenewalTime: string;
    Status: QuestStatusEnum;
    BonusTakenAt: string | null;
}

export interface IQuestTask {
    ActionTitle: IIndexing<string>;
    ActionUrl: string;
    Description: IIndexing<string>;
    ID: number;
    ImageActive: string;
    ImageNotActive: string;
    Name: IIndexing<string>;
    ProgressDetails: IQuestTaskProgressDetails;
    Status: QuestTaskStatusEnum;
}

export const enum QuestStatusEnum {
    /** Quest tasks not completed **/
    NOT_COMPLETED = 0,
    /** Quest tasks completed **/
    COMPLETED = 1,
    /** Quest tasks completed, prize can be received **/
    OPENED = 2,
    /** Quest prize received **/
    FINISHED = 3,
}

/**
 * Tasks with negative statuses do not affect the completion of the quest.
 * */
export const enum QuestTaskStatusEnum {
    DISABLED = -2,
    NOT_USED = -1,
    ENABLED = 0,
    COMPLETED = 1,
}

export type TQuestTarget = 'Bet'
                         | 'Deposit'
                         | 'GroupWins'
                         | 'Login'
                         | 'Verification'
                         | 'Win'
                         | 'Withdrawal'
                         | 'Empty';

export interface IQuestTaskProgressDetails {
    Current: number;
    Target: TQuestTarget;
    Total: number;
}

export interface IQuestProgress {
    Total: number;
    Ready: number;
    /**
     * Quest task statuses {..., "taskId": taskStatus, ...}
     * */
    TaskStatuses?: Record<string, QuestTaskStatusEnum>;
    /**
     * Rewarded bonus id
     * */
    Bonus?: number;
}

export interface IOrderModifier {
    /**
     * Objects property or ordering iterator
     */
    iterator: (keyof QuestModel | QuestTaskModel) | ((item: QuestModel | QuestTaskModel) => unknown);
    /**
     * Order direction
     */
    order?: TSortDirection;
}

export interface IDataModifiers {
    /**
     * Params for lodash method _orderBy
     */
    orders?: IOrderModifier[];
}

export interface IDataModifier {
    quests?: IDataModifiers;
    tasks?: IDataModifiers;
}

export interface IQuestNotification {
    questTitle: string;
    questMessage: string;
    fallbackIcon: string;
}

export interface IGetSubscribeParams {
    observer: PartialObserver<IQuestsDataModels>;
    until: Observable<unknown>;
    useQuery?: boolean;
    modifyData?: boolean;
    pipes?:  OperatorFunction<IQuestsDataModels, unknown>;
}

export interface IQuestsConfig {
    notification?: IQuestNotification;
    /**
     * Modification like ordering for task list
     */
    questsDataModifiers?: IDataModifier;
}

export interface IRewardData {
    Status?: number;
    Bonus?: IBonus;
    error?: string;
}

export interface ITakeRewardData extends IRewardData {
    /**
     * Date of claiming the reward
     */
    BonusTakenAt?: string;
}

export interface IWSQuestData {
    timestamp: string;
    timestamp_ms: number;
    Node: number;
    odb_event_id: string;
    action: string;
    quest_id: number;
    user_id: number;
    quest_name: string;
    image: string;
    api_id: number;
    dwh_event_id: string;
}

