import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
    ITableCol,
    ITableCParams,
} from 'wlc-engine/modules/core';

import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';
import {ILevelNameCParams} from 'wlc-engine/modules/loyalty/components/loyalty-levels/level-name/level-name.params';
import {LevelNameComponent} from 'wlc-engine/modules/loyalty/components/loyalty-levels/level-name/level-name.component';
import {ILevelNumberCParams}
    from 'wlc-engine/modules/loyalty/components/loyalty-levels/level-number/level-number.params';
import {LevelNumberComponent}
    from 'wlc-engine/modules/loyalty/components/loyalty-levels/level-number/level-number.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyLevelTableCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    filterType?: 'select' | 'button',
    /** wlc-profile-no-content params **/
    emptyConfig?: IWrapperCParams;
    tableConfig?: ITableCParams;
    /** array of ITableCol keys to be excluded from table **/
    excludedHeadKeys?: string[],
}

export const defaultParams: ILoyaltyLevelTableCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-table',
    class: 'wlc-loyalty-table',
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('An error has occurred while loading data. Please try again later.'),
                },
            },
        ],
    },
    tableConfig: {
        pagination: {
            use: false,
            breakpoints: null,
        },
    },
};

export const loyaltyTableHeadConfig: ITableCol[] = [
    {
        key: 'level',
        title: gettext('Level'),
        type: 'component',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_level',
        mapValue: (item: LoyaltyLevelModel): ILevelNumberCParams => {
            return {item};
        },
        componentClass: LevelNumberComponent,
    },
    {
        key: 'name',
        title: gettext('Level name'),
        type: 'component',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_name',
        mapValue: (item: LoyaltyLevelModel): ILevelNameCParams => {
            return {level: item};
        },
        componentClass: LevelNameComponent,
    },
    {
        key: 'nextLevelPoints',
        title: gettext('Experience'),
        type: 'text',
        order: 40,
        wlcElement: 'wlc-profile-table__cell_experience',
        mapValue: (item: LoyaltyLevelModel): string => {
            if (item.isLast && !item.nextLevelPoints) {
                return `${item.currentLevelPoints}+`;
            } else {
                return `${item.nextLevelPoints}`;
            }
        },
    },
    {
        key: 'confirmPoints',
        title: gettext('Level hold points'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_points',
        description: gettext(
            'These are experience points that must be gained over a thirty-day period in order to stay at ' +
            'the current level. If this does not happen, the level will be lowered to the previous one.'),
    },
    {
        key: 'coef',
        title: gettext('Coefficient'),
        type: 'text',
        order: 60,
        wlcElement: 'wlc-profile-table__cell_coefficient',
    },
];
