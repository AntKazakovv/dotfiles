/*
@example

    modify current layout
    <pre>
        modify: [
            {
                type: 'replace',
                position: 'base.wlc-logo#2',
                component: {
                    name: 'base.test-replace'
                },
            },
            {
                type: 'insert',
                position: 'before base.wlc-logo#2',
                component: {
                    name: 'base.test-insert'
                }
            },
            {
                type: 'delete',
                position: 'base.wlc-logo#2',
            }
        ],
    </pre>
*/
import {ILayoutsConfig} from 'wlc-engine/interfaces/layouts.interface';

export const $layouts: ILayoutsConfig = {
    'app': {
        sections: {
            header: {
                order: 0,
                components: [
                    {
                        name: 'base.wlc-logo',
                    },
                    {
                        name: 'base.language-selector',
                    },
                ],
            },
            content: {},
            footer: {
                order: 1000,
                components: [
                    {
                        name: 'base.wlc-logo',
                    },
                ],
            },
        },
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
                        name: 'base.language-selector',
                    },
                ],
            },
            content: {
                components: [
                    {
                        name: 'menu.wlc-menu',
                        params: {
                            type: 'main-menu',
                        },
                    },
                ],
            },
        },
    },
    'app.catalog': {
        extends: 'app.home',
        sections: {
            content: {
                components: [
                    {
                        name: 'menu.eng-main-menu',
                    },
                ],
            },
        },
    },
    'app.gameplay': {
        extends: 'app',
        sections: {
            content: {
                components: [
                    {
                        name: 'games.wlc-game-wrapper'
                    }
                ],
                order: 2
            }
        },
    },
};

