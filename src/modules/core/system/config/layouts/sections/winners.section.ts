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

    export const stripeDef: ILayoutSectionConfig = {
        container: true,
        theme: 'stripe',
        components: [
            componentLib.wlcLastWinsSlider.stripe,
        ],
    };

    export const stripeWithTitle: ILayoutSectionConfig = {
        container: true,
        theme: 'stripe',
        components: [
            componentLib.wlcLastWinsSlider.stripeWithTitle,
        ],
    };

    export const stripeWithTitleInContainer: ILayoutSectionConfig = {
        container: true,
        theme: 'stripe',
        modifiers: ['in-container'],
        components: [
            componentLib.wlcLastWinsSlider.stripeWithTitle,
        ],
    };
}
