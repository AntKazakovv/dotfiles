import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace  winnersSection {
    export const home: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.winnersSection,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'winners-wrapper',
                    components: [
                        componentLib.wlcLastWinsSlider.one,
                        componentLib.wlcBiggestWinsSlider.one,
                        componentLib.wlcJackpotsSlider.one,
                    ],
                },
            },
        ],
    };
}
