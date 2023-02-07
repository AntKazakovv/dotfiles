import {
    IComponentParams,
    CustomType,
    ITableCol,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {Bet} from 'wlc-engine/modules/profile/system/models/bet-history.model';
import {
    BetPreviewComponent,
} from 'wlc-engine/modules/profile/components/bet-history/bet-preview/bet-preview.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBetHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    transactionTableTheme: 'default' | 'mobile-app' | Theme,
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
}

export const defaultParams: IBetHistoryCParams = {
    moduleName: 'core',
    componentName: 'wlc-bet-history',
    class: 'wlc-bet-history',
    transactionTableTheme: 'default',
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No bets history'),
                },
            },
        ],
    },
};

export const betHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'Date',
        title: gettext('Bet time'),
        type: 'component',
        order: 10,
        mapValue: (item: Bet) => ({bet: item}),
        componentClass: BetPreviewComponent,
        wlcElement: 'wlc-profile-table__cell_time',
    },
    {
        key: 'Amount',
        title: gettext('Amount'),
        type: 'amount',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_amount',
    },
    {
        key: 'Merchant',
        title: gettext('Provider'),
        type: 'text',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_merchant',
    },
    {
        key: 'GameName',
        title: gettext('Game'),
        type: 'text',
        order: 40,
        wlcElement: 'wlc-profile-table__cell_game',
    },
];
