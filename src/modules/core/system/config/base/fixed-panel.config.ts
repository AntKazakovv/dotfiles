import {IFixedPanelConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';

export const fixedPanelConfig: IFixedPanelConfig = {
    use: false,
    panels: {
        left: {
            compactModByDefault: false,
            sizes: {
                full: 230,
                compact: 48,
            },
            breakpoints: {
                display: 1024,
                expand: 1630,
            },
            useBackdrop: true,
        },
        right: {
            compactModByDefault: false,
            sizes: {
                full: 320,
                compact: 0,
            },
            breakpoints: {
                display: 0,
                expand: 1630,
            },
            useBackdrop: false,
        },
    },
};
