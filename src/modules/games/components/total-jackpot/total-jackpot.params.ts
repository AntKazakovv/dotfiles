import {RawParams} from '@uirouter/core';

import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';
import {CountUpOptions} from 'countup.js';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {IAnimateSpriteCParams} from 'wlc-engine/modules/core/components/animate-sprite/animate-sprite.params';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';


export type ComponentTheme = 'default' | 'info' | 'games-inside' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'label' | string;
export type TotalJackpotNoContentByThemeType = Partial<Record<ComponentTheme, INoContentCParams>>;

export interface INoJackpotBtn {
    /** Inside link */
    sref?: string;
    /** Params for sref */
    params?: RawParams;
    /** Caption of the button */
    text?: string;
}

export interface ITotalJackpotCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    countUpOptions?: CountUpOptions;
    noContent?: TotalJackpotNoContentByThemeType;
    animateOnClick?: boolean;
    text?: string;
    animateSprite?: IAnimateSpriteCParams;
    /**
     * Section title
     */
    title?: String;
    /**
     * Params of wlc-games-grid component who shows jackpot games
     */
    gamesGridParams?: IGamesGridCParams;
    /**
     * Fallback button params when jackpots list is empty
     */
    noJackpotBtn?: INoJackpotBtn;
}

export const defaultParams: ITotalJackpotCParams = {
    class: 'wlc-total-jackpot',
    moduleName: 'games',
    componentName: 'wlc-total-jackpot',
    theme: 'default',
    animateOnClick: false,
    text: gettext('Total jackpot to be won'),
    countUpOptions: {
        separator: ' ',
        decimalPlaces: 0,
        decimal: ',',
    },
    animateSprite: {
        imageUrl: '/gstatic/sprites/star-sprite.png',
    },
    title: gettext('Total Jackpot'),
    gamesGridParams: {
        theme: 'swiper',
        type: 'swiper',
        themeMod: 'centered-controls',
        usePlaceholders: true,
        gamesRows: 1,
        gamesList: [],
        showTitle: false,
        moreBtn: {
            hide: false,
        },
        showAllLink: {
            use: true,
            position: 'bottom',
            sref: 'app.catalog',
            params: {
                category: 'jackpots',
            },
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
                            slidesPerView: 2.4,
                            slidesPerGroup: 2,
                            spaceBetween: 10,
                        },
                        560: {
                            slidesPerView: 2.8,
                            slidesPerGroup: 2,
                            spaceBetween: 10,
                        },
                        720: {
                            slidesPerView: 4.1,
                            slidesPerGroup: 3,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 4,
                            slidesPerGroup: 4,
                            spaceBetween: 15,
                        },
                        1200: {
                            slidesPerView: 4,
                            slidesPerGroup: 3,
                            spaceBetween: 15,
                        },
                        1630: {
                            slidesPerView: 5,
                            slidesPerGroup: 4,
                            spaceBetween: 20,
                        },
                    },
                },
            },
        },
        thumbParams: {
            showJackpotAmount: true,
        },
    },
    noJackpotBtn: {
        sref: 'app.catalog',
        params: {
            category: 'new',
        },
        text: gettext('Play'),
    },
};

