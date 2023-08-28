import {IIndexing} from 'wlc-engine/modules/core';

export type TAchievementTarget = 'Bet'
                                | 'Deposit'
                                | 'GroupWins'
                                | 'Login'
                                | 'Verification'
                                | 'Win'
                                | 'Withdrawal'
                                | 'Empty';

export interface IAchievementProgressDetails {
    Current: string;
    Target: TAchievementTarget;
    Total: string;
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
};

export interface IAchievement {
    ActionTitle: string | IIndexing<string>;
    ActionUrl: string;
    Description: string | IIndexing<string>;
    EndDate?: string | null;
    GroupName: string | IIndexing<string>;
    ID: string;
    IDGroup: string;
    ImageActive: string;
    ImageNotActive: string;
    Name: string | IIndexing<string>;
    PrizeDescription: string | IIndexing<string>;
    Progress?: string;
    ProgressDetails?: IAchievementProgressDetails;
    Status?: '0' | '1';
}

export interface IWSAchievementData {
    timestamp?: string,
    Node?: number,
    action?: string,
    achievement_id?: number,
    user_id?: number,
    achievement_name?: string,
}

export interface IWSAchievement {
    status?: string,
    system?: string,
    event?: string,
    data?: IWSAchievementData,
}
