import {ILayoutSectionConfig} from 'wlc-engine/modules/core';

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
            {
                name: 'mobile.wlc-app-updater',
            },
            {
                name: 'mobile.wlc-sidebar-menu',
                reloadOnStateChange: true,
            },
        ],
    };

    export const subMenu: ILayoutSectionConfig = {
        container: false,
        components: [
            {
                name: 'mobile.wlc-sidebar-menu',
                reloadOnStateChange: true,
            },
        ],
    };
}
