import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace header {
    export const def: ILayoutSectionConfig = {
        order: 0,
        theme: '1',
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userIcon,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.login,
        ],
    };
}

