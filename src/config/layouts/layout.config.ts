import {ILayoutsConfig} from './layouts.interface';

export const layouts: ILayoutsConfig = {
    'app': {
        sections: {
            header: {
                components: [
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
                        name: 'base.logo'
                    },
                    {
                        name: 'menu.mainMenu',
                        params: {
                            test: true,
                        }
                    }
                ],
            },
            footer: {
                components: [
                    {
                        name: 'menu.mainMenu'
                    }
                ]
            }
        }
    },
    'app.catalog': {
        extends: 'app.home',
        sections: {
            header: {
                components: [
                    {
                        name: 'menu.mainMenu'
                    },
                    {
                        name: 'base.language-selector'
                    },
                    {
                        name: 'base.logo'
                    },
                ],
            },
            content: {
                components: [
                    {
                        name: 'menu.mainMenu'
                    }
                ]
            },

        }
    }
};

