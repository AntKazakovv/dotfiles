import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export const $panelsLayouts: IPanelsConfig = {
    'app': {
        sections: {
            left: {
                components: [
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
                    {
                        name: 'user.wlc-user-stats',
                        display: {
                            auth: true,
                        },
                    },
                    {
                        name: 'menu.wlc-mobile-menu',
                        params: {
                            type: 'dropdown',
                            themeMod: 'vertical',
                        },
                    },
                ],
            },
        },
    },
    'app.home': {
        extends: 'app',
    },
};
