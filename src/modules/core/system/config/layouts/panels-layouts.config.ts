import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export const $panelsLayouts: IPanelsConfig = {
    'app': {
        sections: {
            left: {
                components: [
                    {
                        name: 'menu.wlc-category-menu',
                        params: {
                            type: 'dropdown',
                        },
                    },
                    {
                        name: 'user.wlc-login-signup',
                        display: {
                            auth: false,
                        },
                        params: {
                            login: {
                                action: 'login',
                            },
                            signup: {
                                action: 'signup',
                            },
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
