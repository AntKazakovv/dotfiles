import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcPostMenu {
    export const footerInfo: ILayoutComponent = {
        name: 'static.wlc-post-menu',
        params: {
            themeMod: 'footer-info',
            wlcElement: 'wlc-footer-info__block_legal',
            common: {
                categorySlug: 'legal',
                title: gettext('Information'),
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
                basePath: {
                    page: 'contacts',
                    addLanguage: true,
                },
            },
        },
    };
}
