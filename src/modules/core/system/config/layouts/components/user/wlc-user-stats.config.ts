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

    export const mobile: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        display: {
            auth: true,
            before: 1199,
        },
        params: {
            type: 'mobile',
        },
    };

    export const dashboard: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        params: {
            themeMod: 'dashboard',
            useDepositBtn: false,
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        display: {
            auth: true,
        },
        params: {
            useIcons: true,
            fieldsView: 'fullWithAbbreviation',
            theme: 'wolf',
            useDetailsBtn: true,
            useDepositBtn: false,
        },
    };

    export const wolfBurger: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        display: {
            auth: true,
        },
        params: {
            useIcons: true,
            fieldsView: 'full',
            theme: 'wolf',
            useDetailsBtn: true,
            useDepositBtn: false,
        },
    };

    export const wolfDescription: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        display: {
            auth: true,
        },
        params: {
            fields: [
                'balance',
                'bonusBalance',
                'points',
                'level',
                'expPoints',
            ],
            useIcons: true,
            fieldsView: 'fullWithAbbreviation',
            theme: 'wolf',
            useDetailsBtn: false,
            useDepositBtn: false,
        },
    };

    export const wolfHeader: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        display: {
            auth: true,
        },
        params: {
            theme: 'wolf',
            type: 'header',
        },
    };
}
