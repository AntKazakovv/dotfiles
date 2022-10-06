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
}
