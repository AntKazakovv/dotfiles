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
                        name: 'menu.wlc-mobile-menu',
                        params: {
                            type: 'dropdown',
                            themeMod: 'vertical',
                            common: {
                                useArrow: true,
                            },
                        },
                    },
                    {
                        name: 'core.wlc-language-selector',
                        params: {
                            themeMod: 'long',
                        },
                    },
                ],
            },
            right: {
                components: [
                    {
                        name: 'user.wlc-user-stats',
                    },
                    {
                        name: 'menu.wlc-profile-menu',
                        params: {
                            theme: 'dropdown',
                            themeMod: 'vertical',
                            type: 'dropdown',
                            common: {
                                useArrow: true,
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
};
