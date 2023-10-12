import {ILoyaltyConfig} from '../interfaces/interfaces';

export const loyaltyConfig: ILoyaltyConfig = {
    loyalty: {
        programTitle: gettext('Loyalty Program'),
        iconsDirPath: '/loyalty-program',
        iconsExtension: 'png',
        iconFallback: '/loyalty-program/loyalty-fallback.png',
    },
};
