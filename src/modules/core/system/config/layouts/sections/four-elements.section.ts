import {
    ILayoutSectionConfig,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace fourElementsSection {
    export const def: ILayoutSectionConfig = {
        container: true,
        display: {
            after: 1024,
        },
        components: [
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'four-elements',
                    components: [
                        componentLib.wlcCashOutTime.def,
                        componentLib.wlcTotalJackpot.info,
                        componentLib.wlcTopRated.def,
                        componentLib.wlcLuckyButton.def,
                    ],
                },
            },
        ],
    };
}
