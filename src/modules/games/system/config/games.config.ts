import {IGamesConfig} from '../interfaces/games.interfaces';

export const gamesConfig: IGamesConfig = {
    mobile: {
        loginUser: {
            disableDemo: false,
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
};
