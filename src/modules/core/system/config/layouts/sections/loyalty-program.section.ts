import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace  loyaltyProgramSection {
    export const homeLoyalty: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcLoyaltyProgram.def,
        ],
    };
}
