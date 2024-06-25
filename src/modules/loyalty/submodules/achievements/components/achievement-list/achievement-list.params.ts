import {
    CustomType,
    IComponentParams,
    IPagination,
} from 'wlc-engine/modules/core';
import {
    IAchievementItemParams,
    IModifier,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | 'wolf' | CustomType;
export type TOrder = 'asc' | 'desc';

export interface IAchievementListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /**
     * Modification like ordering for achievement list
     */
    modifier?: IModifier;
    /**
     * Params for pagination
     */
    pagination?: IPagination;
    /**
     * Achievements order value
     */
    achievementsOrder?: TOrder;
    /**
     * Is need hide received achievements
     */
    hideReceived?: boolean;
    itemParams?: IAchievementItemParams,
}

export const defaultParams: IAchievementListCParams = {
    moduleName: 'achievements',
    componentName: 'wlc-achievement-list',
    class: 'wlc-achievement-list',
    modifier: {
        type: 'order',
        field: 'status',
        values: [
            'received',
            'in-progress',
            'not-started',
        ],
    },
    pagination: {
        use: true,
        breakpoints: {
            375: {
                itemPerPage: 8,
            },
        },
    },
    hideReceived: false,
    achievementsOrder: 'desc',
};
