import {IPanelsConfig} from 'wlc-engine/interfaces/layouts.interface';

export const $panelsLayouts: IPanelsConfig = {
    'app': {
        sections: {
            left: {
                components: [
                    {
                        name: 'menu.wlc-menu',
                        params: {
                            type: 'affiliates-menu',
                        },
                    },
                ],
            },
            right: {
                components: [
                    {
                        name: 'menu.wlc-menu',
                        params: {
                            type: 'affiliates-menu',
                        },
                    },
                ],
            },
        },
    },
    'app.home': {
        extends: 'app',
    },
    'app.catalog': {
        extends: 'app',
    },
};
