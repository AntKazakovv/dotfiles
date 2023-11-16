import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {
    IAdditionalFreeSpins,
    IBuyFreeSpinsParams,
} from 'wlc-engine/modules/tournaments';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'dashboard' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamenFreeSpinsParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    balanceText?: string;
    freeSpinsText?: string;
    freeSpins?: IAdditionalFreeSpins;
    buttonText?: string;
    tournamentId?: number;
    buyParams?: IBuyFreeSpinsParams;
    modalIconPath?: string;
    textReplenish?: string;
    textFreeRoundsInPackage?: string;
    textDebitedBalance?: string;
    textAvailableReplenishments?: string;
    textClickBuy?: string;
}

export const defaultParams: ITournamenFreeSpinsParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-tournament-free-spins',
    class: 'wlc-tournament-free-spins',
    title: gettext('Replenish your free spins balance and increase your chances of winning!'),
    balanceText: gettext('Balance'),
    freeSpinsText: gettext('Free spins'),
    buttonText: gettext('Buy now'),
    modalIconPath: '/wlc/tournaments/icons/buy-free-spins.svg',
    textClickBuy: gettext('Click "Buy now" to replenish.'),
    textFreeRoundsInPackage: gettext('Your free spins balance will be replenished with:'),
    textDebitedBalance: gettext('Your real balance will be debited on: '),
    textAvailableReplenishments: gettext('Available number of replenishments:'),
};
