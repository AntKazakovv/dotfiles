import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

import {ILatestBetsItemCParams} from 'wlc-engine/modules/promo/components/latest-bets-item/latest-bets-item.params';

export type Theme = 'default' | CustomType;
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
};
