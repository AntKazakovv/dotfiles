import {IComponentParams, CustomType} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games';

export type Type = 'default' | 'modal' | 'vertical' | CustomType;
export type Theme = 'default' | 'vertical' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IGameThumbCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    verticalImagesPath?: string;
    common?: {
        themeMod?: ThemeMod;
        game?: Game,
        useMerchantName?: boolean,
    };
};

export const defaultParams: IGameThumbCParams = {
    moduleName: 'games',
    componentName: 'wlc-game-thumb',
    class: 'wlc-game-thumb',
    common: {
        useMerchantName: false,
    },
    verticalImagesPath: '/static/images/vertical-thumb/',
};
