import {
    IBurgerPanelCParams,
    IComponentParams,
    IIndexing,
} from 'wlc-engine/modules/core';

export interface IFloatPanelsCParams extends IComponentParams <string, string, string> {
    /** Params for each panel by name */
    panels?: IIndexing<IBurgerPanelCParams>;
}

export interface IFloatPanelsComponentEvents {
    /** `PANEL_OPEN` event fires opening of panel */
    PANEL_OPEN: string;

    /** `PANEL_CLOSE` event fires closing of panel */
    PANEL_CLOSE: string,
}

export const defaultParams: IFloatPanelsCParams = {
    moduleName: 'core',
    componentName: 'wlc-float-panels',
    class: 'wlc-float-panels',
    panels: {
        'left-v2': {
            type: 'left',
        },
        'left-def': {
            type: 'left',
            touchEvents: {
                use: false,
            },
        },
        'left-mobile': {
            type: 'left',
        },
        'left-fixed': {
            type: 'left-fixed',
        },
        'right-fixed': {
            type: 'right-fixed',
        },
        right: {
            type: 'right',
            title: gettext('Profile'),
        },
    },
};

export const panelsEvents: IFloatPanelsComponentEvents = {
    PANEL_OPEN: 'PANEL_OPEN',
    PANEL_CLOSE: 'PANEL_CLOSE',
};
