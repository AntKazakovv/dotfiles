import {ILayoutSectionConfig} from 'wlc-engine/modules/core';

export namespace providers {
    export const slider: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-links',
            },
        ],
    };

    export const games: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-games',
            },
        ],
    };
}
