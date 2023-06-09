import {IIndexing} from 'wlc-engine/modules/core';

export type TAchievementTarget = 'Bet' | 'Deposit' | 'GroupWins' | 'Login' | 'Verification' | 'Win' | 'Withdrawal';

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
    Description: string | IIndexing<string>;
    GroupName: string | IIndexing<string>;
    ID: string;
    IDGroup: string;
    ImageActive: string;
    ImageNotActive: string;
    Name: string | IIndexing<string>;
    EndDate?: string | null;
    Progress?: string;
    ProgressDetails?: IAchievementProgressDetails;
    Status?: '0' | '1';
}
