import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBonusesList {
    export const main: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                filter: 'main',
            },
        },
    };
    export const active: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                restType: 'active',
                filter: 'active',
            },
        },
    };
    export const inventory: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                filter: 'inventory',
            },
        },
    };
}
