import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IThemeTogglerCParams} from 'wlc-engine/modules/core/';

export namespace wlcThemeToggler {
    export const def: ILayoutComponent = {
        name: 'core.wlc-theme-toggler',
    };

    export const defCompact: ILayoutComponent = {
        name: 'core.wlc-theme-toggler',
        params: <IThemeTogglerCParams>{
            themeMod: 'compact',
        },
    };

    export const vertical: ILayoutComponent = {
        name: 'core.wlc-theme-toggler',
        display: {
            after: 1200,
        },
        params: <IThemeTogglerCParams>{
            themeMod: 'vertical',
        },
    };

    export const long: ILayoutComponent = {
        name: 'core.wlc-theme-toggler',
        params: <IThemeTogglerCParams>{
            theme: 'long',
        },
    };
}
