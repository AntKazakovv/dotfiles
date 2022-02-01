import {ElementRef} from '@angular/core';
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
                       'bottom-all' | 'bottom-title' | 'transform' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type MediaType = 'background' | 'foreground' | 'logo' | 'video';

export interface IMediaContent {
    src: string;
    type: string;
}

export interface ICoordinates {
    x: number;
    y: number;
}

export interface IStaticTransformData {
    /**
     * all transform elements
     */
    layersAll: ElementRef<HTMLElement>[];
    /**
     * host element center coords
     */
    centerCoords: ICoordinates;
    /**
     * the value involved in the calculations to obtain values for transform
     */
    hostSteps: ICoordinates;
    /**
     * the value involved in the calculations to obtain values for transform
     */
    layerSteps: ICoordinates[];
}

export interface ITransformThumb {
    /**
     * the values influencing the strength of the transformation
     * the more the stronger the transformation
     */
    correct?: {
        /**
        * adjusted by rotateX() and rotateY()
        */
        host?: Partial<ICoordinates>,
        /**
         * adjusted by translateX() and translateY()
         */
        layers?: Partial<ICoordinates>,
    }
    
}

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
         /**
         * game id or array of games id and choose first not undefined
         */
        gameId?: number | number[];
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
    },
    /**
     * settings vertical transform thumb
    */
    transformThumb?: ITransformThumb;
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
