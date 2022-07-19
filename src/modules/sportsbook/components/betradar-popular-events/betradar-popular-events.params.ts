import {SwiperOptions} from 'swiper';
import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBetradarPopularEventsCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        title?: string;
        swiper?: SwiperOptions;
    },
}

export const defaultParams: IBetradarPopularEventsCParams = {
    moduleName: 'sportsbook',
    componentName: 'wlc-betradar-popular-events',
    class: 'wlc-betradar-popular-events',
    theme: 'default',
    themeMod: 'default',
    common: {
        title: gettext('Popular events'),
        swiper: {
            allowTouchMove: true,
            slidesPerView: 1,
        },
    },
};
