import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBannersSlider {
    export const home: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            theme: 'default-banner',
            filter: {
                position: ['home'],
            },
            swiper: {
                slidesPerView: 1,
                navigation: true,
                pagination: {
                    clickable: true,
                    type: 'bullets',
                },
            },
        },
    };
}
