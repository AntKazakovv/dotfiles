import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcPostMenu {
    export const footerInfo: ILayoutComponent = {
        name: 'static.wlc-post-menu',
        params: {
            themeMod: 'footer-info',
            wlcElement: 'wlc-footer-info__block_legal',
            asListBp: '(max-width: 899px)',
            common: {
                categorySlug: ['legal', 'about-us'],
                useSlider: true,
                groupBySlag: true,
                basePath: {
                    page: 'contacts',
                    addLanguage: true,
                },
            },
        },
    };

    export const footerFirst: ILayoutComponent = {
        name: 'static.wlc-post-menu',
        params: {
            themeMod: 'footer-first',
            wlcElement: 'wlc-footer-info__block_legal',
            common: {
                categorySlug: ['legal', 'about-us'],
                useSlider: false,
                groupBySlag: true,
                basePath: {
                    page: 'contacts',
                    addLanguage: true,
                },
            },
        },
    };

    export const footerAbout: ILayoutComponent = {
        name: 'static.wlc-post-menu',
        params: {
            themeMod: 'footer-about',
            wlcElement: 'wlc-footer-info__block_about-us',
            common: {
                categorySlug: 'about-us',
                title: 'About Us',
                basePath: {
                    page: 'contacts',
                    addLanguage: true,
                },
            },
        },
    };

    export const burgerPanelInfo: ILayoutComponent = {
        name: 'static.wlc-post-menu',
        params: {
            theme: 'burger-panel',
            themeMod: 'burger-panel-info',
            wlcElement: 'wlc-burger-panel__block_legal',
            common: {
                categorySlug: 'legal',
                exclude: ['feedback'],
                basePath: {
                    page: 'contacts',
                    addLanguage: true,
                },
            },
        },
    };
}
