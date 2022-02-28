import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';

export const $panelsLayoutsKiosk: IPanelsConfig = {
    'app': {
        sections: {
            'left-mobile': sectionsLib.leftPanel.kiosk,
            right: sectionsLib.rightPanel.kiosk,
        },
    },
    'app.home': {
        extends: 'app',
    },
};
