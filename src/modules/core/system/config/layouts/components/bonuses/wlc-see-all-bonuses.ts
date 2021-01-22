import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSeeAllBonuses {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                filter: 'main',
            },
        },
    };
}
