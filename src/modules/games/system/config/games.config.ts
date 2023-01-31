import {GamesSortEnum} from 'wlc-engine/modules/games/system/interfaces/sorts.enums';
import {IGamesConfig} from '../interfaces/games.interfaces';

export enum SpecialCategoriesGamesSlug {
    favorites = 'favourites',
    lastGames = 'lastplayed',
}

export const gamesConfig: IGamesConfig = {
    fundist: {
        defaultCategorySettings: {
            use: false,
        },
    },
    mobile: {
        loginUser: {
            disableDemo: false,
        },
        /**
         * Which providers don't need to use a mobile iframe
         * Can be enabled for all games of the provider or for a specific one using the launchCodes parameter
         *
         * Example:
         * notRunInIframe: {
         *     "944": {
         *         launchCodes: ['killSoft', 'slotWS']
         *     },
         * }
         */
        notRunInIframe: {
            '944': {},
            '945': {},
            '942': {},
            '912': {},
            '917': {},
            '987': {},
        },
        /**
         * Show game header for a certain merchants
         */
        showGameHeader: {
            merchants: [990],
        },
    },
    run: {
        skipCheckBalance: false,
        checkProfileRequiredFields: true,
        checkActiveBonusRestriction: true,
    },
    realPlay: {
        disable: false,
        disableByCountry: {
            default: [],
            forMerchant: {
                '992': ['usa'],
            },
        },
    },
    categories: {
        useFundistJackpots: false,
        exclude: {
            bySlug: [
                'casinogames',
            ],
        },
        hide: {
            bySlug: [
                'vertical',
                'verticalthumbnails',
            ],
        },
        parents: [
            'casino',
            'livecasino',
        ],
        gamesSortSetting: {
            direction: {
                sortPerCountry: 'asc',
                sortPerLanguage: 'asc',
                sortPerCategory: 'asc',
                baseSort: 'desc',
            },
        },
    },
    // See here for video compression: https://habr.com/ru/post/442020/
    mediaFormatTypes: {
        'hevc.mp4': 'video/mp4; codecs=hevc,mp4a.40.2',
        'av1.mp4': 'video/mp4; codecs=av01.0.05M.08,opus',
        'h264.mp4': 'video/mp4; codecs=avc1.4D401E,mp4a.40.2',

        'avif': 'image/avif',
        'webp': 'image/webp',
    },
    verticalThumbsConfigUrl: '/gstatic/vertical-thumbs/vertical-thumb.json',
    verticalImagesPath: '/gstatic/vertical-thumbs/',
    sportsbookMerchants: [958, 972, 993, 962, 937, 903, 922, 908, 893],
    components: {
        'wlc-total-jackpot': {
            noContent: {
                default: {
                    title: gettext('Oh, all the available jackpots have been played. New jackpots' +
                        ' will appear later. In the meantime, we offer you to have a look at our new games.'),
                    redirectBtn: {
                        useBtn: false,
                    },
                },
            },
        },
    },
    slimGamesRequest: true,
    search: {
        byCyrillicLetters: true,
    },
    merchantWallet: {
        availableMerchants: [
            883, // BetFair
            890, // MiniGame
            891, // Mega888
            893, // Nova
            937, // Pinnacle
            964, // OrientalGame
            982, // GGNetwork
        ],
        balanceRequestTimeout: 30000,
        systemOptions: {
            883: {
                currency: null,
            },
        },
    },
    cacheSettings: {
        searchGames: {
            saveTime: Number.MAX_SAFE_INTEGER,
            chipsCount: 3,
        },
    },

    sorts: {
        use: false,
        settings: {
            direction: {
                [GamesSortEnum.LocalPerCategoriesByCountries]: 'desc',
                [GamesSortEnum.LocalByCountries]: 'desc',
                [GamesSortEnum.LocalByLanguages]: 'desc',
                [GamesSortEnum.LocalByCategories]: 'desc',
                [GamesSortEnum.Local]: 'desc',

                [GamesSortEnum.GlobalPerCategoriesByCountries]: 'desc',
                [GamesSortEnum.GlobalByCountries]: 'desc',
                [GamesSortEnum.GlobalByLanguages]: 'desc',
                [GamesSortEnum.GlobalByCategories]: 'desc',
                [GamesSortEnum.Global]: 'desc',
            },
        },
    },
};
