import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

import {
    ISliderCParams,
} from 'wlc-engine/modules/core';
import {IYoutubeVideoModel} from '../../system/models/youtube-block.model';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IShowAsSwiper {
    /**
     * Use navigation buttons
     */
    useNavigation?: boolean;
    sliderParams: ISliderCParams;
}

export interface IThumbListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    thumbs: IYoutubeVideoModel[];
    showAsSwiper?: IShowAsSwiper;
}

export const defaultParams: IThumbListCParams = {
    moduleName: 'youtube-block',
    componentName: 'wlc-thumb-list',
    class: 'wlc-thumb-list',
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
                        slidesPerView: 1.2,
                        slidesPerGroup: 1,
                        spaceBetween: 10,
                        followFinger: false,
                    },
                    560: {
                        slidesPerView: 1.2,
                        slidesPerGroup: 1,
                        spaceBetween: 10,
                        followFinger: false,
                    },
                    720: {
                        slidesPerView: 2.1,
                        slidesPerGroup: 2,
                        spaceBetween: 10,
                        followFinger: false,
                    },
                    1024: {
                        slidesPerView: 2.6,
                        slidesPerGroup: 2,
                        spaceBetween: 15,
                        followFinger: true,
                    },
                    1200: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                        spaceBetween: 15,
                    },
                    1630: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                        spaceBetween: 20,
                    },
                },
            },
        },
    },
    thumbs: [],
};
