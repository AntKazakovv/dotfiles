import {IMenu} from 'wlc-engine/modules/core/system/interfaces/menu.interface';

export const fundistSettings: IMenu = {
    categoryMenu: {
        items: [
            {
                type: 'page',
                id: 'lobby',
                name: {
                    en: 'Lobby',
                },
                order: 10,
                device: 'all',
            },
            {
                type: 'page',
                id: 'favourites',
                name: {
                    en: 'My favourites',
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
    mobileMenu: {
        items: [
            {
                type: 'page',
                id: 'favourites',
                name: {
                    en: 'My favourites',
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
                id: 'sportsbook',
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
};
