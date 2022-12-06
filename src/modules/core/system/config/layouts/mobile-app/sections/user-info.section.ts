import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/mobile-app/components';

export namespace userInfoSection {
    export const menu: ILayoutSectionConfig = {
        container: false,
        components: [
            {
                name: 'user.wlc-user-name',
                params: {
                    type: 'mobile-app',
                    theme: 'mobile-app',
                },
            },
            {
                name: 'user.wlc-user-stats',
                params: {
                    useDepositBtn: true,
                    type: 'menu-mobile',
                },
                display: {
                    auth: true,
                },
            },
            componentLib.wlcProfileMenu.vertical,
            componentLib.wlcMobileMenu.vertical,
            componentLib.wlcLanguageSelector.long,
        ],
    };
}
