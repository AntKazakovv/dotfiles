import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace infoPage {
    export const contacts: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcInfoPage.contacts,
        ],
    };
}
