import {IGamesConfig} from '../interfaces/games.interfaces';

export const gamesConfig: IGamesConfig = {
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
            "944": {},
            "942": {},
            "912": {},
            "987": {},
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
                "992": ['usa', 'fra', 'cuw', 'gbr', 'esp', 'ita'],
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
        parents: [
            'casino',
            'livecasino',
        ],
    },
    // See here for video compression: https://habr.com/ru/post/442020/
    mediaFormatTypes: {
        'hevc.mp4': 'video/mp4; codecs=hevc,mp4a.40.2',
        'av1.mp4': 'video/mp4; codecs=av01.0.05M.08,opus',
        'h264.mp4': 'video/mp4; codecs=avc1.4D401E,mp4a.40.2',

        'avif': 'image/avif',
        'webp': 'image/webp',
    },
    idVerticalVideos: [
        1558042,
    ],
    sportsbookMerchants: [958, 972, 993, 962, 937, 903, 922, 908],
};
