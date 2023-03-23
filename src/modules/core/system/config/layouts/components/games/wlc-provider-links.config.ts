import {IProviderLinksCParams} from 'wlc-engine/modules/games';
import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcProviderLinks {

    export const mobileParams: ILayoutComponent = {
        name: 'games.wlc-provider-links',
        params: <IProviderLinksCParams>{
            iconsType: 'color',
            colorIconBg: 'dark',
            themeMod: 'mobile-custom',
            sliderParams: {
                loop: false,
                enabled: false,
                init: false,
                spaceBetween: 0,
                slidesPerView: 2,
                slidesPerGroup: 1,
                breakpoints: {
                    720: {
                        enabled: true,
                        loop: true,
                        init: true,
                    },
                    1024: {
                        spaceBetween: 15,
                        slidesPerView: 5,
                        slidesPerGroup: 5,
                    },
                    1366: {
                        spaceBetween: 15,
                        slidesPerView: 6,
                        slidesPerGroup: 6,
                    },
                    1630: {
                        spaceBetween: 15,
                        slidesPerView: 7,
                        slidesPerGroup: 7,
                    },
                },
            },
        },
    };
}
