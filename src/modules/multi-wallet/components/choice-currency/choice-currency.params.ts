import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'in-modal' | CustomType;

export interface IChoiceCurrencyParams extends IComponentParams<Theme, Type, ThemeMod> {
    balanceText?: string;
    game?: Game;
    btnText?: string;
}

export const defaultParams: IChoiceCurrencyParams = {
    moduleName: 'multi-wallet',
    class: 'wlc-choice-currency',
    componentName: 'wlc-choice-currency',
    balanceText: gettext('Balance in currency:' ),
    btnText: gettext('Apply'),
};
