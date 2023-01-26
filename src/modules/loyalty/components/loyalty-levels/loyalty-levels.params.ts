import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
    ITableCol,
} from 'wlc-engine/modules/core';

import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';
import {ILevelNameParams} from 'wlc-engine/modules/loyalty/components/loyalty-levels/level-name/level-name.params';
import {LevelNameComponent} from 'wlc-engine/modules/loyalty/components/loyalty-levels/level-name/level-name.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILoyaltyLevelTableCParams extends IComponentParams<Theme, Type, ThemeMod> {
    filterType?: 'select' | 'button',
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
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
};

export const loyaltyTableHeadConfig: ITableCol[] = [
    {
        key: 'level',
        title: gettext('Level'),
        type: 'text',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_level',
    },
    {
        key: 'name',
        title: gettext('Level name'),
        type: 'component',
        disableHideClass: true,
        order: 30,
        wlcElement: 'wlc-profile-table__cell_name',
        mapValue: (item: LoyaltyLevelModel): ILevelNameParams => {
            return {level: item};
        },
        componentClass: LevelNameComponent,
    },
    {
        key: 'nextLevelPoints',
        title: gettext('Experience'),
        type: 'text',
        wlcElement: 'wlc-profile-table__cell_experience',
        order: 40,
    },
    {
        key: 'coef',
        title: gettext('Coefficient'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_coefficient',
    },
];
