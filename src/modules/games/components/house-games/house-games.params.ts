import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'label' | string;

export interface IHouseGamesCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Section title
     */
    title?: string;
    description?: string;
    /**
     * Params of wlc-games-grid component who shows jackpot games
     */
    gamesGridParams?: IGamesGridCParams;
}

export const defaultParams: IHouseGamesCParams = {
    class: 'wlc-house-games',
    moduleName: 'games',
    componentName: 'wlc-house-games',
    title: gettext('Original games'),
    description: gettext('The biggest giveaway from our casino!'),
    gamesGridParams: {
        theme: 'swiper',
        themeMod: 'bottom-controls',
        type: 'swiper',
        usePlaceholders: true,
        gamesRows: 1,
        showTitle: false,
        filter: {
            categories: [],
            merchants: [777],
        },
        moreBtn: {
            hide: false,
        },
        showAsSwiper: {
            useNavigation: true,
            sliderParams: {
                swiper: {
                    slidesPerView: 2.4,
                    slidesPerGroup: 1,
                    grid: null,
                    spaceBetween: 10,
                    breakpoints: {
                        375: {
                            slidesPerView: 2.2,
                            slidesPerGroup: 2,
                            spaceBetween: 12,
                            followFinger: false,
                        },
                        560: {
                            slidesPerView: 2.8,
                            slidesPerGroup: 2,
                            spaceBetween: 12,
                        },
                        720: {
                            slidesPerView: 4,
                            slidesPerGroup: 4,
                            spaceBetween: 12,
                        },
                    },
                },
            },
        },
        openContext: 'house-games',
    },
};
