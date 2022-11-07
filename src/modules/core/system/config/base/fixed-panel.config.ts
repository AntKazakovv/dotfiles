import {IFixedPanelConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';

export const fixedPanelConfig: IFixedPanelConfig = {
    use: false,
    position: 'left',
    compactModByDefault: false,
    sizes: {
        full: 250,
        compact: 60,
        gap: 15,
    },
    breakpoints: {
        display: 1024,
        expand: 1630,
    },
};
