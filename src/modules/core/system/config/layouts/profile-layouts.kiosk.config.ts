import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';

export const $profileKioskLayouts: ILayoutsConfig = {
    'app.profile': {
        extends: 'app',
        sections: {
            'profile-tablet-menu-wrapper': sectionsLib.profileContent.profileTypeFirstTabletMenu,
        },
    },
    'app.profile.main.info': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMainTypeKiosk,
        },
    },
    'app.profile.gamblings.bets': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBetHistoryTypeKiosk,
        },
    },
    'app.profile.cash.transactions': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTransactionsTypeFirst,
        },
    },
};
