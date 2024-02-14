import {SwiperOptions} from 'swiper/types/swiper-options';

import {IBonusesListCParams, IGameDashboardBonusesCParams} from 'wlc-engine/modules/bonuses';
import {ILayoutComponent} from 'wlc-engine/modules/core';

const generateSwiperOptions = (slides: number, mod: string = 'default'): SwiperOptions => {
    return {
        slidesPerView: 'auto',
        navigation: {
            nextEl: `.wlc-bonuses-list--theme-mod-${mod} .wlc-swiper-button-next`,
            prevEl: `.wlc-bonuses-list--theme-mod-${mod} .wlc-swiper-button-prev`,
        },
        pagination: false,
        spaceBetween: 20,
        breakpoints: {
            1200: {
                slidesPerView: slides,
                slidesPerGroup: slides - 1,
            },
        },
    };
};

export namespace wlcBonusesWolf {

    export const main: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'wolf',
            common: {
                pagination: {
                    use: true,
                    breakpoints: {
                        '0': {
                            itemPerPage: 6,
                        },
                        '768': {
                            itemPerPage: 12,
                        },
                    },
                },
            },
        },
    };

    export const mainModVertical: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'wolf',
            themeMod: 'vertical',
        },
    };

    export const mainSlider: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'wolf',
            type: 'swiper',
            hideNavigation: false,
            common: {
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
                swiper: generateSwiperOptions(3),
            },
            titleParams: {
                text: gettext('Bonuses'),
                iconPath: 'wlc/icons/european/v3/bonuses.svg',
            },
            allBtnParams: {
                theme: 'wolf-rounded',
                common: {
                    text: gettext('All'),
                    sref: 'app.profile.loyalty-bonuses.main',
                },
            },
        },
    };

    export const mainSliderModVertical: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'wolf',
            themeMod: 'vertical',
            type: 'swiper',
            hideNavigation: false,
            common: {
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
                swiper: generateSwiperOptions(4, 'vertical'),
            },
            titleParams: {
                text: gettext('Bonuses'),
                iconPath: 'wlc/icons/european/v3/bonuses.svg',
            },
            allBtnParams: {
                theme: 'wolf-rounded',
                common: {
                    text: gettext('All'),
                    sref: 'app.profile.loyalty-bonuses.main',
                },
            },
        },
    };

    export const profileDashboardSlider: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'wolf',
            type: 'swiper',
            hideNavigation: false,
            wlcElement: 'block_bonuses-main',
            placement: 'profile-dashboard',
            common: {
                useQuery: true,
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
                swiper: generateSwiperOptions(3),
            },
            titleParams: {
                text: gettext('Bonuses'),
                iconPath: 'wlc/icons/european/v3/bonuses.svg',
            },
            allBtnParams: {
                theme: 'wolf-rounded',
                common: {
                    text: gettext('All'),
                    sref: 'app.profile.loyalty-bonuses.main',
                },
            },
        },
    };

    export const promotions: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'wolf',
            common: {
                filter: 'all',
                filterByGroup: 'Promo',
                sortOrder: ['active', 'promocode', 'subscribe', 'inventory'],
                pagination: {
                    use: false,
                },
            },
            redirectBtnToProfile: {
                use: true,
            },
            btnNoBonuses: {
                use: true,
            },
            titleParams: {
                text: gettext('Bonuses'),
                iconPath: 'wlc/icons/european/v3/bonuses.svg',
            },
            allBtnParams: {
                theme: 'wolf-rounded',
                common: {
                    text: gettext('All'),
                    sref: 'app.profile.loyalty-bonuses.main',
                },
            },
        },
    };

    export const regBonusesSlider: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            wlcElement: 'block_bonuses',
            type: 'swiper',
            theme: 'reg-first',
            themeMod: 'wolf',
            hideNavigation: false,
            common: {
                restType: 'any',
                filter: 'reg',
                selectFirstBonus: true,
                useBlankBonus: false,
                swiper: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    loop: false,
                    followFinger: false,
                    pagination: false,
                    navigation: {
                        nextEl: '.wlc-bonuses-list--theme-reg-first .wlc-swiper-button-next',
                        prevEl: '.wlc-bonuses-list--theme-reg-first .wlc-swiper-button-prev',
                    },
                },
            },
            itemsParams: {
                theme: 'wolf',
                themeMod: 'vertical',
                type: 'reg',
                bonusModalParams: {
                    hideBonusButtons: true,
                },
                buttonsParams: {
                    hideButtons: true,
                },
            },
            btnNoBonuses: {
                use: false,
            },
            navigationParams: {
                theme: 'wolf',
                themeMod: 'lg',
            },
        },
    };

    export const gameDashboardBonuses: ILayoutComponent = {
        name: 'bonuses.wlc-game-dashboard-bonuses',
        params: <IGameDashboardBonusesCParams>{
            theme: 'wolf',
        },
    };
}
