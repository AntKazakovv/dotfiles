import {IInteractiveText} from 'wlc-engine/modules/core';

export const interactiveTextConfig: IInteractiveText[] = [
    {
        title: gettext('Want more promo content?'),
        text: gettext('See all bonuses'),
        actionParams: {
            url: {
                path: 'app.profile.loyalty-bonuses.main',
            },
        },
        useFor: 'all',
    },
    {
        title: gettext('Do you want to top up your balance?'),
        text: gettext('Deposit'),
        actionParams: {
            url: {
                path: 'app.profile.cash.deposit',
            },
        },
        useFor: 'all',
    },
    {
        title: gettext('Pay attention to the games which are popular among our users!'),
        text: gettext('Have a look'),
        actionParams: {
            url: {
                path: 'app.catalog',
                params: {category: 'popular'},
            },
        },
        useFor: 'all',
    },
    {
        title: gettext('New games on our project!'),
        text: gettext('Have a look'),
        actionParams: {
            url: {
                path: 'app.catalog',
                params: {category: 'new'},
            },
        },
        useFor: 'all',
    },
    {
        title: gettext('Hit the jackpot in our jackpot games!'),
        text: gettext('Hit Jackpot'),
        actionParams: {
            url: {
                path: 'app.catalog',
                params: {
                    category: 'casino',
                    childCategory: 'jackpots',
                },
            },
        },
        useFor: 'all',
    },
    {
        title: gettext('The best products in our store!'),
        text: gettext('Go to store'),
        actionParams: {
            url: {
                path: 'app.profile.loyalty-store.main',
            },
        },
        useFor: 'store',
    },
    {
        title: gettext('Take part in the tournament competition and get a prize!'),
        text: gettext('Go to Tournaments'),
        actionParams: {
            url: {
                path: 'app.tournaments',
            },
        },
        useFor: 'tournaments',
    },
];
