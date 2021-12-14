import {ILayoutSectionConfig} from 'wlc-engine/modules/core';

export namespace promoAboutUs {
    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-title',
                params: {
                    mainText: gettext('About us'),
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'home-about-list',
                    components: [
                        {
                            name: 'static.wlc-post',
                            params: {
                                theme: 'about-us',
                                slug: 'sitetext-games',
                            },
                        },
                        {
                            name: 'static.wlc-post',
                            params: {
                                theme: 'about-us',
                                slug: 'sitetext-cashback',
                            },
                        },
                        {
                            name: 'static.wlc-post',
                            params: {
                                theme: 'about-us',
                                slug: 'sitetext-withdrawals',
                            },
                        },
                    ],
                },
            },
        ],
    };
}
