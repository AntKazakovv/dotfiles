import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSeeAllBonuses {
    export const def: ILayoutComponent = {
        name: 'core.wlc-link-block',
        params: {
            wlcElement: 'block_all-bonuses',
            themeMod: 'secondary',
            common: {
                useInteractiveText: true,
            },
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'core.wlc-link-block',
        params: {
            wlcElement: 'block_all-bonuses',
            theme: 'wolf',
            themeMod: 'secondary',
            common: {
                useInteractiveText: true,
            },
        },
    };
};
