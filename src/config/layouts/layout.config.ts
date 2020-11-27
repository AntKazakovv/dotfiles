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
                        name: 'core.wlc-logo',
                    },
                    {
                        name: 'core.wlc-language-selector',
                    },
                ],
            },
            content: {},
            footer: {
                order: 1000,
                components: [
                    {
                        name: 'core.wlc-logo',
                    },
                ],
            },
        },
    },
    'app.home': {
        extends: 'app',
    },
    'app.catalog': {
        extends: 'app.home',
    },
    'app.gameplay': {
        extends: 'app',
        sections: {
            content: {
                components: [
                    {
                        name: 'games.wlc-game-wrapper',
                    },
                ],
                order: 2,
            },
        },
    },
    'app.profile': {
        sections: {
            'profile': {
                container: true,
                components: [
                    {
                        name: 'user.wlc-profile-form',
                    },
                ],
            },
        },
    },
    'app.contacts': {
        extends: 'app',
        sections: {
            'info-page': {
                container: true,
                components: [
                    {name: 'core.wlc-info-page'},
                ],
            },
        },
    },
};

