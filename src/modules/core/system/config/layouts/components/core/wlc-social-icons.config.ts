import {
    ILayoutComponent,
    ISocialIconsCParams,
} from 'wlc-engine/modules/core';

export namespace wlcSocialIcons {
    export const def: ILayoutComponent = {
        name: 'core.wlc-social-icons',
        params: <ISocialIconsCParams>{},
    };

    export const compact: ILayoutComponent = {
        name: 'core.wlc-social-icons',
        params: {
            themeMod: 'compact',
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'core.wlc-social-icons',
        params: {
            theme: 'wolf',
        },
    };

    export const menuThemeWolf: ILayoutComponent = {
        name: 'core.wlc-social-icons',
        params: {
            theme: 'wolf',
            themeMod: 'menu',
        },
    };
}
