import {
    IComponentParams,
    CustomType,
    TIconShowAs,
    TIconColorBg,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games';
import * as ButtonParams from 'wlc-engine/modules/core/components/button/button.params';

export type Type = 'default' | 'modal' | 'vertical' | 'promo-widget' | CustomType;
export type Theme = 'default' | 'vertical' | 'promo-widget' | CustomType;
export type ThemeMod = 'default' | 'vertical' | 'circle'  | 'bottom-buttons' |
                       'bottom-all' | 'bottom-title' | CustomType;
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
        /**
         * merchant icon usage params
         */
        merchantIcon?: {
            /**
             * enable/disable usage merchant icon
             */
            use: boolean;
            /**
             * show as 'img' or 'svg' ('img' by default)
             */
            showAs?: TIconShowAs;
            /**
             * background color depedency tag ('dark' or 'light')
             */
            colorIconBg?: TIconColorBg;
        }
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
