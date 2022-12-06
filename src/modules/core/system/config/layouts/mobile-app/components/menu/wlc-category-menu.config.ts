import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcCategoryMenu {
    export const categoriesWithIcons: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        params: {
            theme: 'mobile-app',
            type: 'categories-menu',
            common: {
                useSwiperNavigation: false,
                icons: {
                    folder: 'mobile-app/categories/',
                    use: true,
                },
            },
            menuParams: {
                sliderParams: {
                    swiper: {
                        slidesPerGroup: 4,
                        slidesPerView: 4,
                        pagination: {
                            clickable: true,
                        },
                    },
                },
            },
        },
    };
}
