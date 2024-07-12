import {IIndexing} from 'wlc-engine/modules/core';

export type TAchievementTarget = 'Bet'
    | 'Deposit'
    | 'GroupWins'
    | 'Login'
    | 'Verification'
    | 'Win'
    | 'Withdrawal'
    | 'Empty';

export type TItemModalTheme = 'modal' | 'modal-wolf';

export interface IAchievementProgressDetailsBase {
    Current: string;
    Target: TAchievementTarget;
    Total: string;
}

export interface IAchievementProgressDetails extends IAchievementProgressDetailsBase {
    CurrentLevelDetails: IAchievementProgressDetailsBase | null;
}

export interface IModifier {
    /**
     * Name of modification
     */
    type: 'order';
    /**
     * Name of field used for modification
     */
    field: 'id' | 'groupId' | 'status' | 'progressTarget';
    /**
     * Values of field used for modification
     */
    values: (number | string)[];
}

export interface IAchievementData {
    achievements: IAchievement[],
    groups: IAchievementGroup[],
}

export interface IAchievement {
    ActionTitle: string | IIndexing<string>;
    ActionUrl: string;
    LevelsInfo?: IAchievementLevelInfo[],
    Description: string | IIndexing<string>;
    EndDate?: string | null;
    ID: string;
    IDGroup: string;
    ImageActive: string;
    ImageNotActive: string;
    Name: string | IIndexing<string>;
    PrizeDescription: string | IIndexing<string>;
    ProgressDetails?: IAchievementProgressDetails;
    Status?: '0' | '1';
}

export interface IAchievementGroup {
    ID: string,
    Name: string | IIndexing<string>,
    Weight: string,
}

export interface IWSAchievementData {
    timestamp?: string,
    Node?: number,
    action?: string,
    achievement_id?: number,
    user_id?: number,
    achievement_name?: string,
    isLevelOfGroup?: boolean,
}

export interface IAchievementLevelInfo {
    name: string | IIndexing<string>,
    description: string | IIndexing<string>,
}

export interface IAchievementsConfig {
    achievements: {
        notification: {
            titleText: string,
            message: string,
            levelUpTitleText: string,
            levelUpMessage: string,
        },
    },
}

export interface IAchievementItemParams {
    infoIconPath: string,
    modalTheme: TItemModalTheme,
}
