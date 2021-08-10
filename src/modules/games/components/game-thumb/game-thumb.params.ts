import {IComponentParams, CustomType} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games';
import * as ButtonParams from 'wlc-engine/modules/core/components/button/button.params';

export type Type = 'default' | 'modal' | 'vertical' | 'promo-widget' | 'named' | CustomType;
export type Theme = 'default' | 'vertical' | 'promo-widget' | CustomType;
export type ThemeMod = 'default' | 'named' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IGamePromoWidget {
    title?: string;
    gameCategory?: string;
}

export interface IGameThumbButtonsSettings {
    theme?: ButtonParams.Theme,
    themeMode?: ButtonParams.ThemeMod,
    demoTheme?: ButtonParams.Theme,
    demoThemeMode?: ButtonParams.ThemeMod,
}

export interface IGameThumbCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        game?: Game,
        gameId?: number;
        useMerchantName?: boolean,
        promoWidget?: IGamePromoWidget;
    }
}

export const defaultParams: IGameThumbCParams = {
    moduleName: 'games',
    componentName: 'wlc-game-thumb',
    class: 'wlc-game-thumb',
    common: {
        useMerchantName: false,
        promoWidget: {
            title: gettext('New game'),
            gameCategory: 'new',
        },
    },
};
