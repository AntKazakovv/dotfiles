import {SwiperOptions} from 'swiper';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    RestType,
    BonusesFilterType,
} from '../../system/interfaces/bonuses.interface';

export type Type = 'default' | 'swiper' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBonusesListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        restType?: RestType;
        filter?: BonusesFilterType;
        title?: string;
        sortOrder?: ('active' | 'subscribe' | 'inventory' | number)[],
        swiper?: SwiperOptions;
    };
}

export const defaultParams: IBonusesListCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonuses-list',
    class: 'wlc-bonuses-list',
    common: {
        restType: 'any',
        filter: 'all',
        title: 'Bonuses',
    },
};
