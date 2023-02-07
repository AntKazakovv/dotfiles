import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcUserStats {
    export const def: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        display: {
            auth: true,
        },
    };

    export const kiosk: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        params: {
            customMod: 'without-btn',
            fields: [
                'balance',
                'bonusBalance',
            ],
            useDepositBtn: false,
        },
    };

    export const store: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        params: {
            type: 'store',
        },
    };

    export const storeWithDescriptionIcon: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        params: {
            type: 'store',
            showTooltipDescriptionModal: true,
        },
    };

    export const storeWithDescriptionIconMob: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        params: {
            themeMod: 'mobile-app',
            type: 'store',
            showTooltipDescriptionModal: true,
        },
    };
}
