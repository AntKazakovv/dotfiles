import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';

export const $panelsLayouts: IPanelsConfig = {
    'app': {
        sections: {
            'left-def': sectionsLib.leftPanel.def,
            'left-v2': sectionsLib.leftPanel.left,
            'left-mobile': sectionsLib.leftPanel.mobile,
            right: sectionsLib.rightPanel.def,
        },
    },
    'app.home': {
        extends: 'app',
    },
};
