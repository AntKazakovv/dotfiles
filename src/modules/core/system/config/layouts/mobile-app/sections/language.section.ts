import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace languageSection {

    export const def: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcLanguageSelector.mobileApp,
        ],
    };
}
