import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcMobileMenu {
    export const vertical: ILayoutComponent = {
        name: 'menu.wlc-mobile-menu',
        params: {
            type: 'dropdown',
            themeMod: 'vertical',
            common: {
                useArrow: true,
            },
        },
    };

    export const liveChatButton: ILayoutComponent = {
        name: 'livechat.wlc-livechat-button',
    };
}
