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
import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

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
        extends: 'app',
        sections: {
            profile: {
                container: true,
                components: [
                    {
                        name: 'menu.wlc-profile-menu',
                        params: {
                        },
                    },
                    {
                        name: 'menu.wlc-profile-menu',
                        params: {
                            type: 'submenu',
                        },
                    },
                ],
            },
            content: {
            },
        },
    },
    'app.profile.main.info': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                    {
                        name: 'user.wlc-profile-form',
                    },
                ],
            },
        },
    },
    'app.profile.social': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-bonuses.main': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-bonuses.active': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-bonuses.inventory': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-bonuses.history': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-bonuses.promo': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-bonuses.system': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-tournaments.main': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-tournaments.active': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-tournaments.history': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.cash.deposit': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                    {
                        name: 'finances.wlc-deposit',
                    },
                ],
            },
        },
    },
    'app.profile.cash.withdraw': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                    {
                        name: 'wlc-withdraw',
                    },
                ],
            },
        },
    },
    'app.profile.cash.wallet': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.cash.transactions': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                    {
                        name: 'finances.wlc-transaction-history',
                    },
                ],
            },
        },
    },
    'app.profile.gamblings.bets': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-store.main': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-store.orders': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.messages': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.verification': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.password': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.notifications': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.payments': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.limits': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.loyalty-level': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.referrals': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.profile.dashboard': {
        extends: 'app.profile',
        sections: {
            content: {
                container: true,
                components: [
                ],
            },
        },
    },
    'app.contacts': {
        extends: 'app.profile',
        sections: {
            'info-page': {
                container: true,
                components: [
                    {name: 'core.wlc-info-page'},
                ],
            },
        },
    },
    'app.catalog': {
        extends: 'app',
        sections: {
            content: {
                components: [

                ],
                order: 2,
            },
        },
    },
    'app.catalog.child': {
        replaceConfig: true,
        extends: 'app.catalog',
    },
};
