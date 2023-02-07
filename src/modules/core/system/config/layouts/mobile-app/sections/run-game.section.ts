import {ILayoutSectionConfig} from 'wlc-engine/modules/core';

export namespace runGameSection {

    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'mobile.wlc-run-game',
            },
        ],
    };
}
