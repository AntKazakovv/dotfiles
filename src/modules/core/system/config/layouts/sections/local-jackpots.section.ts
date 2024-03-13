import {ILayoutSectionConfig} from 'wlc-engine/modules/core/system/interfaces';
import * as componentLib from '../components';

export namespace localJackpots {

    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcLocalJackpots.def,
        ],
    };

    export const banner: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcLocalJackpots.banner,
        ],
    };
}
