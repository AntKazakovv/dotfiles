import {IMenu} from 'wlc-engine/modules/core/system/interfaces/menu.interface';

export const fundistSettings: IMenu = {
    categoryMenu: {
        items: [
            {
                type: 'page',
                id: 'lobby',
                name: {
                    en: 'Main page',
                },
                order: 10,
                device: 'all',
            },
            {
                type: 'page',
                id: 'favourites',
                name: {
                    en: 'My favorites',
                },
                order: 20,
                device: 'all',
            },
            {
                type: 'page',
                id: 'lastplayed',
                name: {
                    en: 'Last played',
                },
                order: 30,
                device: 'all',
            },
            {
                type: 'page',
                id: 'recommendations',
                name: {
                    en: 'Suggested for you',
                },
                order: 35,
                device: 'all',
            },
            {
                type: 'category',
                id: 'new',
                name: {
                    en: 'New games',
                },
                order: 40,
                device: 'all',
            },
            {
                type: 'category',
                id: 'popular',
                name: {
                    en: 'Popular',
                },
                order: 50,
                device: 'all',
            },
            {
                type: 'category',
                id: 'livecasino',
                name: {
                    en: 'Live Casino',
                },
                order: 60,
                device: 'all',
            },
            {
                type: 'category',
                id: 'slots',
                name: {
                    en: 'Slots',
                },
                order: 70,
                device: 'all',
            },

            {
                type: 'category',
                id: 'megawaysglobal',
                name: {
                    en: 'Megaways',
                },
                order: 80,
                device: 'all',
            },
            {
                type: 'category',
                id: 'bonusbuyglobal',
                name: {
                    en: 'Bonus buy',
                },
                order: 90,
                device: 'all',
            },
            {
                type: 'category',
                id: 'jackpots',
                name: {
                    en: 'Jackpots',
                },
                order: 100,
                device: 'all',
            },
            {
                type: 'category',
                id: 'tablegames',
                name: {
                    en: 'Table games',
                },
                order: 110,
                device: 'all',
            },
        ],
    },
    panelMenuInfo: {
        items: [
            {
                type: 'page',
                id: 'contacts',
                name: {
                    en: 'Contact us',
                },
                order: 10,
                device: 'all',
            },
            {
                type: 'page',
                id: 'info',
                order: 20,
                device: 'all',
            },
        ],
    },
    panelMenu: {
        items: [
            {
                type: 'page',
                id: 'home',
                name: {
                    en: 'Main page',
                },
                order: 10,
                device: 'all',
            },
            {
                type: 'page',
                id: 'favourites',
                name: {
                    en: 'My favorites',
                },
                order: 20,
                device: 'all',
            },
            {
                type: 'page',
                id: 'lastplayed',
                name: {
                    en: 'Last played',
                },
                order: 30,
                device: 'all',
            },
            {
                type: 'category',
                id: 'recommendations',
                name: {
                    en: 'Suggested for you',
                },
                order: 35,
                device: 'all',
            },
            {
                type: 'dropdown',
                id: 'allgames',
                name: {
                    en: 'All games',
                },
                order: 40,
                items: [
                    {
                        type: 'category',
                        id: 'livecasino',
                        name: {
                            en: 'Live Casino',
                        },
                        order: 50,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'casino',
                        name: {
                            en: 'Casino',
                        },
                        order: 60,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'new',
                        name: {
                            en: 'New games',
                        },
                        order: 70,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'popular',
                        name: {
                            en: 'Popular',
                        },
                        order: 80,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'megawaysglobal',
                        name: {
                            en: 'Megaways',
                        },
                        order: 90,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'bonusbuyglobal',
                        name: {
                            en: 'Bonus buy',
                        },
                        order: 100,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'jackpots',
                        name: {
                            en: 'Jackpots',
                        },
                        order: 110,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'virtualsports',
                        name: {
                            en: 'Virtual Sports',
                        },
                        order: 120,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'baccarat',
                        name: {
                            en: 'Baccarat',
                        },
                        order: 130,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'slots',
                        name: {
                            en: 'Slots',
                        },
                        order: 140,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'pokerglobal',
                        name: {
                            en: 'Poker',
                        },
                        order: 150,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'tablegames',
                        name: {
                            en: 'Table games',
                        },
                        order: 160,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'blackjacks',
                        name: {
                            en: 'Blackjacks',
                        },
                        order: 170,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'rouletteglobal',
                        name: {
                            en: 'Roulette',
                        },
                        order: 180,
                        device: 'all',
                    },
                ],
                device: 'all',
            },
            {
                type: 'page',
                id: 'sportbook',
                order: 50,
                device: 'all',
            },
            {
                type: 'page',
                id: 'marathon',
                order: 55,
                device: 'all',
            },
            {
                type: 'page',
                id: 'promotions',
                order: 60,
                device: 'all',
            },
            {
                type: 'page',
                id: 'tournaments',
                order: 70,
                device: 'all',
            },
        ],
    },
    mobileMenu: {
        items: [
            {
                type: 'page',
                id: 'favourites',
                name: {
                    en: 'My favorites',
                },
                order: 10,
                device: 'all',
            },
            {
                type: 'page',
                id: 'lastplayed',
                name: {
                    en: 'Last played',
                },
                order: 20,
                device: 'all',
            },
            {
                type: 'category',
                id: 'recommendations',
                name: {
                    en: 'Suggested for you',
                },
                order: 25,
                device: 'all',
            },
            {
                type: 'dropdown',
                id: 'game-categories',
                name: {
                    en: 'All games',
                },
                order: 30,
                items: [
                    {
                        type: 'category',
                        id: 'new',
                        name: {
                            en: 'New games',
                        },
                        order: 40,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'popular',
                        name: {
                            en: 'Popular',
                        },
                        order: 50,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'casino',
                        name: {
                            en: 'Casino',
                        },
                        order: 60,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'livecasino',
                        name: {
                            en: 'Live Casino',
                        },
                        order: 70,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'slots',
                        name: {
                            en: 'Slots',
                        },
                        order: 80,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'megawaysglobal',
                        name: {
                            en: 'Megaways',
                        },
                        order: 90,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'bonusbuyglobal',
                        name: {
                            en: 'Bonus buy',
                        },
                        order: 100,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'jackpots',
                        name: {
                            en: 'Jackpots',
                        },
                        order: 110,
                        device: 'all',
                    },
                    {
                        type: 'category',
                        id: 'tablegames',
                        name: {
                            en: 'Table games',
                        },
                        order: 120,
                        device: 'all',
                    },
                ],
                device: 'all',
            },
            {
                type: 'page',
                id: 'marathon',
                order: 40,
                device: 'all',
            },
            {
                type: 'page',
                id: 'promotions',
                order: 50,
                device: 'all',
            },
            {
                type: 'page',
                id: 'tournaments',
                order: 60,
                device: 'all',
            },
        ],
    },
    stickyFooter: {
        items: [
            {
                type: 'page',
                id: 'menu',
                name: {
                    en: 'Menu',
                },
                order: 10,
                device: 'mobile',
            },
            {
                type: 'category',
                id: 'casino',
                name: {
                    en: 'Casino',
                },
                order: 20,
                device: 'mobile',
            },
            {
                type: 'category',
                id: 'livecasino',
                name: {
                    en: 'Live Casino',
                },
                order: 30,
                device: 'mobile',
            },
            {
                type: 'page',
                id: 'deposit',
                name: {
                    en: 'Deposit',
                },
                order: 40,
                device: 'mobile',
            },
            {
                type: 'page',
                id: 'login',
                name: {
                    en: 'Login',
                },
                order: 50,
                device: 'mobile',
            },
            {
                type: 'page',
                id: 'signup',
                name: {
                    en: 'Sign up',
                },
                order: 60,
                device: 'mobile',
            },
            {
                type: 'page',
                id: 'profile',
                name: {
                    en: 'Profile',
                },
                order: 70,
                device: 'mobile',
            },
        ],
    },
    infoPageMenu: {
        items: [
            {
                type: 'page',
                id: 'legal',
                order: 20,
                device: 'all',
            },
        ],
    },
};
