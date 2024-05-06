import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace  winnersSection {
    export const home: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcLastWinsSlider.one,
            componentLib.wlcJackpotsSlider.one,
            componentLib.wlcBiggestWinsSlider.one,
        ],
        smartSection: {
            hostClasses: 'wlc-mb-xl',
            innerClasses: 'wlc-gap-smd wlc-mb-md',
            columns: [
                'wlc-c-12 wlc-c-720-6 wlc-c-1200-4',
                'wlc-c-12 wlc-c-720-6 wlc-c-1200-4',
                'wlc-c-12 wlc-c-720-6 wlc-c-1200-4',
            ],
        },
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
