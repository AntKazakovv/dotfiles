import {
    CustomType,
    IComponentParams,
    IPagination,
} from 'wlc-engine/modules/core';
import {IModifier} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IAchievementListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /**
     * Modification like ordering for achievement list
     */
    modifier?: IModifier;
    /**
     * Params for pagination
     */
    pagination?: IPagination;
}

export const defaultParams: IAchievementListCParams = {
    moduleName: 'loyalty',
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
};
