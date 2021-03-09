import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IBurgerPanelCParams} from './../burger-panel/burger-panel.params';
import {IIndexing} from 'wlc-engine/modules/core';

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
    class: 'wlc-float-panels',
    panels: {
        'left-v2': {
            type: 'left',
        },
        'left-def': {
            type: 'left',
        },
        'left-mobile': {
            type: 'left',
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
