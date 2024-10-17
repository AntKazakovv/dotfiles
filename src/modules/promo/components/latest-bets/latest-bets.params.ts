import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

import {ILatestBetsItemCParams} from 'wlc-engine/modules/promo/components/latest-bets-item/latest-bets-item.params';
import {IPreloaderCParams} from 'wlc-engine/modules/core/components/preloader/preloader.params';

export type Theme = 'default' | 'wolf'| CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILatestBetsCParams extends IComponentParams<Theme, Type, ThemeMod> {
    bet?: ILatestBetsItemCParams;
    betsCount?: number,
    highRollersValue?: number,
    tableHead: string[],
    fakeParams?: {
        count?: number;
        minBet: number,
        maxBet: number,
        currency?: string,
    },
    preloader?: {
        /** use preloader or not */
        use?: boolean;
        /** base params for wlc-preloader component */
        params?: IPreloaderCParams;
    }
}

export const defaultParams: ILatestBetsCParams = {
    moduleName: 'promo',
    componentName: 'wlc-latest-bets',
    class: 'wlc-latest-bets',
    tableHead: ['Game', 'User', 'Bet Amount', 'Multiplier', 'Profit Amount'],
    betsCount: 5,
    highRollersValue: 100,
    fakeParams: {
        count: 5,
        minBet: 100,
        maxBet: 600,
        currency: 'EUR',
    },
    preloader: {
        use: false,
    },
};
