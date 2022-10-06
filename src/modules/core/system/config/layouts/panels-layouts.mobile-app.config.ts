import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/mobile-app/sections';

export const $panelsLayoutsMobileApp: IPanelsConfig = {
    'app': {
        sections: {
            'left-v2': sectionsLib.leftPanel.left,
            'left-mobile': sectionsLib.leftPanel.mobile,
            right: sectionsLib.rightPanel.def,
        },
    },
    'app.home': {
        extends: 'app',
    },
};
