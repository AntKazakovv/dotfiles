import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILoyaltyLevelTableCParams extends IComponentParams<Theme, Type, ThemeMod> {
    filterType?: 'select' | 'button',
}

export const defaultParams: ILoyaltyLevelTableCParams = {
    class: 'wlc-loyalty-table',
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
        type: 'text',
        disableHideClass: true,
        order: 30,
        wlcElement: 'wlc-profile-table__cell_name',
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
