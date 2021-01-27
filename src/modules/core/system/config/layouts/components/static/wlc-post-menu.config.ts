import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcPostMenu {
    export const footerInfo: ILayoutComponent = {
        name: 'static.wlc-post-menu',
        params: {
            themeMod: 'footer-info',
            wlcElement: 'wlc-footer-info__block_legal',
            common: {
                categorySlug: 'legal',
                title: 'Information',
                basePath: {
                    page: 'static-text',
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
            },
        },
    };
}
