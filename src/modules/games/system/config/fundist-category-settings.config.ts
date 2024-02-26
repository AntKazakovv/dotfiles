import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ICategorySettings} from 'wlc-engine/modules/core/system/interfaces/categories.interface';

export const categorySettings: IIndexing<ICategorySettings> = {
    favourites: {
        view: 'all-games',
    },
    lastplayed: {
        view: 'all-games',
    },
    new: {
        view: 'all-games',
    },
    popular: {
        view: 'all-games',
    },
    rouletteglobal: {
        view: 'all-games',
    },
    blackjacks: {
        view: 'all-games',
    },
    baccaratglobal: {
        view: 'all-games',
    },
    other: {
        view: 'all-games',
    },
    livecasino: {
        view: 'restricted-blocks',
        blocks: {
            rouletteglobal: {
                order: 1,
                showType: 'btn-load-more',
            },
            blackjacks: {
                order: 2,
                showType: 'btn-load-more',
            },
            baccaratglobal: {
                order: 3,
                showType: 'btn-load-more',
            },
            other: {
                order: 4,
                showType: 'btn-load-more',
            },
        },
    },
    slots: {
        view: 'all-games',
    },
    megawaysglobal: {
        view: 'all-games',
    },
    bonusbuyglobal: {
        view: 'all-games',
    },
    jackpots: {
        view: 'all-games',
    },
    tablegames: {
        view: 'all-games',
    },
    vertical: {
        view: 'all-games',
    },
    verticalthumbnails: {
        view: 'all-games',
    },
};
