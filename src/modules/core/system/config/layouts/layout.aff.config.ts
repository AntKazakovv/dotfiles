import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';


export const $layoutsAff: ILayoutsConfig = {
    'app': {
        replaceConfig: true,
        sections: {
            header: sectionsLib.header.aff,
            footer: sectionsLib.footer.themeSecondAff,
        },
    },
    'app.home': {
        replaceConfig: true,
        extends: 'app',
        sections: {
            'banners-aff': sectionsLib.bannerSection.affiliates,
            'anchors-menu': {
                container: true,
                components: [
                    componentLib.wlcMainMenu.affiliates,
                ],
            },
            'benefits-section': {
                container: true,
                components: [
                    {
                        name: 'static.wlc-post',
                        params: {
                            slug: 'partners-benefits',
                            parseAsPlainHTML: true,
                        },
                    },
                ],
            },
            'comission-section': {
                container: true,
                components: [
                    {
                        name: 'static.wlc-post',
                        params: {
                            slug: 'partners-comission',
                            parseAsPlainHTML: true,
                        },
                    },
                ],
            },
            'description-section': {
                container: true,
                components: [
                    {
                        name: 'static.wlc-post',
                        params: {
                            slug: 'partners-why-us',
                            parseAsPlainHTML: true,
                        },
                    },
                ],
            },
            'faq-section': {
                container: true,
                components: [
                    {
                        name: 'static.wlc-faq',
                        params: {
                            common: {
                                title: 'FAQ',
                            },
                        },
                    },
                ],
            },
        },
    },
};
