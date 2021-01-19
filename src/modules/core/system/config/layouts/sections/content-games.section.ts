import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace contentGames {
    export const home: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.allGames2rows,
            componentLib.wlcGamesGrid.roullete1row,
        ],
    };

    export const catalog: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.allGames3rows,
        ],
    };
}

