import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLanguageSelector {
    export const topLeft: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: {
            themeMod: 'top-left',
        },
        display: {
            after: 900,
        },
    };
    export const long: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: {
            themeMod: 'long',
        },
    };
}
