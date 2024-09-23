import {
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
    Bonus,
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

export const enum QuestTaskStatusEnum {
    DISABLED = 0,
    ENABLED = 1,
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
    useQuery: boolean;
    observer: PartialObserver<IQuestsDataModels>;
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

export interface IOpenRewardData {
    Status?: number;
    Bonus?: IBonus;
    error?: string;
}

export interface IOpenRewardResponse {
    newQuestStatus?: QuestStatusEnum;
    bonus?: Bonus;
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

