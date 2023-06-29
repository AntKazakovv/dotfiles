import {GlobalHelper} from 'wlc-engine/modules/core';
import {ILoyaltyConfig} from '../interfaces/interfaces';

export const loyaltyConfig: ILoyaltyConfig = {
    loyalty: {
        programTitle: gettext('Loyalty Program'),
        iconsDirPath: '/loyalty-program',
        iconsExtension: 'png',
        iconFallback: GlobalHelper.gstaticUrl + '/loyalty-program/loyalty-fallback.png',
    },
};
