import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IRealityCheckInfoCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    fromTime?: string;
    tableConfig?: ITableCParams;
}

export const defaultParams: IRealityCheckInfoCParams = {
    moduleName: 'user',
    componentName: 'wlc-reality-check-info',
    class: 'wlc-reality-check-info',
    tableConfig: {
        theme: 'default',
        switchWidth: 0,
        head: [
            {
                key: 'bets',
                title: gettext('Bet'),
                type: 'amount',
                order: 20,
                wlcElement: 'wlc-profile-table__cell_bet',
            },
            {
                key: 'wins',
                title: gettext('Winning'),
                type: 'amount',
                order: 20,
                wlcElement: 'wlc-profile-table__cell_wins',
            },
            {
                key: 'losses',
                title: gettext('Loss'),
                type: 'amount',
                order: 20,
                wlcElement: 'wlc-profile-table__cell_losses',
            },
            {
                key: 'deposits',
                title: gettext('Deposits'),
                type: 'amount',
                order: 20,
                wlcElement: 'wlc-profile-table__cell_deposit',
            },
        ],
    },
};
