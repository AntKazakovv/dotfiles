import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IRandomGameCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    btnText?: string;
    image?: {
        url?: string;
    }
}

export const defaultParams: IRandomGameCParams = {
    moduleName: 'games',
    componentName: 'wlc-random-game',
    class: 'wlc-random-game',
    title: gettext('Random game'),
    btnText: gettext('Play'),
    image: {
        url: '/wlc/icons/random-game/random-game.svg',
    },
};
