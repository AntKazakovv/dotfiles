import {IComponentParams, CustomType} from 'wlc-engine/modules/core';
import {ISliderCParams} from 'wlc-engine/modules/promo';
import {TBonusSortOrder} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IGameDashboardBonusesCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    themeMod?: ThemeMod;
    defaultSliderParams?: ISliderCParams,
    landscapeSliderParams?: ISliderCParams,
    sortOrder?: TBonusSortOrder[];
    numberOfBonuses?: number;
}

export const defaultParams: IGameDashboardBonusesCParams = {
    moduleName: 'games',
    componentName: 'game-dashboard-bonuses',
    class: 'wlc-game-dashboard-bonuses',
    defaultSliderParams: {
        swiper: {
            navigation: {
                nextEl: '.wlc-game-dashboard-bonuses-nav.swiper-button-next',
                prevEl: '.wlc-game-dashboard-bonuses-nav.swiper-button-prev',
            },
            slidesPerView: 1,
        },
    },
    landscapeSliderParams: {
        swiper: {
            pagination: {
                clickable: true,
            },
            slidesPerView: 1,
        },
    },
    sortOrder: ['active', 'promocode', 'subscribe', 'inventory'],
    numberOfBonuses: 10,
};
