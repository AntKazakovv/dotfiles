import {ILayoutsConfig} from './layouts.interface';

export const $layouts: ILayoutsConfig = {
    'app': {
        sections: {
            header: {
                components: [
                    {
                        name: 'base.logo'
                    },
                    {
                        name: 'base.language-selector'
                    },
                    {
                        name: 'base.logo'
                    },
                ]
            },
            content: {},
            footer: {
                components: [
                    {
                        name: 'base.logo'
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
                        name: 'base.eng-logo'
                    },
                    {
                        name: 'base.language-selector'
                    }
                ]
            },
            content: {
                components: [
                    {
                        name: 'menu.eng-main-menu'
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

