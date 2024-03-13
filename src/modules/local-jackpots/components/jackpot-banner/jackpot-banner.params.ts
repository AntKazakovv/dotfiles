import {CountUpOptions} from 'countup.js';

import {IIndexing} from 'wlc-engine/modules/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IGamesGridCParams} from 'wlc-engine/modules/games';

export type JackpotType = 'default' | CustomType;
export type JackpotTheme = CustomType;

export interface IJackpotBannerCParams extends IComponentParams<JackpotTheme, JackpotType, string> {
    gamesGridParams?: IGamesGridCParams;
    noData?: {
        text?: string;
        button?: {
            state?: string;
            params?: IIndexing<string>;
        },
        imgPath?: string;
    }
    countUpOptions?: CountUpOptions;
    animateOnClick?: boolean;
    userCurrency?: string;
};

export const defaultParams: Partial<IJackpotBannerCParams> = {
    moduleName: 'local-jackpots',
    componentName: 'wlc-jackpot-banner',
    class: 'wlc-jackpot-banner',
    userCurrency: 'EUR',
    noData: {
        text: gettext(
            'Oh, all the available jackpots have been played. New jackpots will appear later. ' +
            'In the meantime, we offer you to have a look at our new games.',
        ),
        button: {
            state: 'app.catalog.child',
            params: {
                category: 'casino',
                childCategory: 'new',
            },
        },
        imgPath: 'wlc/jackpots/local-jackpot-money.png',
    },
    countUpOptions: {
        separator: ' ',
    },
    animateOnClick: false,
    gamesGridParams: {
        theme: 'swiper',
        type: 'swiper',
        themeMod: 'centered-controls',
        usePlaceholders: true,
        gamesList: [],
        showTitle: false,
        moreBtn: {
            hide: false,
        },
        showAsSwiper: {
            useNavigation: true,
            maxSlidesCount: 30,
            sliderParams: {
                swiper: {
                    breakpoints: {
                        375: {
                            slidesPerView: 3.2,
                            slidesPerGroup: 3,
                            grid: {
                                rows: 2,
                                fill: 'row',
                            },
                            spaceBetween: 12,
                            followFinger: false,
                        },
                        768: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            grid: {
                                rows: 2,
                                fill: 'row',
                            },
                            spaceBetween: 12,
                            followFinger: false,
                        },
                    },
                },
            },
        },
    },
};
