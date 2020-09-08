import {ILayoutsConfig} from './layouts.interface';

export const $layouts: ILayoutsConfig = {
    'app': {
        sections: {
            header: {
                components: [
                    {
                        name: 'base.wlc-logo',
                    },
                    {
                        name: 'base.language-selector'
                    },
                ]
            },
            content: {},
            footer: {
                components: [
                    {
                        name: 'base.wlc-logo'
                    },
                ]
            }
        }
    },
    'app.home': {
        extends: 'app',
        sections: {
            header: {
                components: [
                    {
                        name: 'base.wlc-logo',
                    },
                    {
                        name: 'base.language-selector'
                    }
                ]
            },
            content: {
                components: [
                    {
                        name: 'menu.wlc-menu',
                        params: {
                            type: 'main-menu'
                        }
                    }
                ]
            }
        }
    },
    'app.catalog': {
        extends: 'app.home',
        sections: {
            content: {
                components: [
                    {
                        name: 'menu.eng-main-menu'
                    }
                ]
            },

        }
    }
};

