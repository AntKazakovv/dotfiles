import {IComponentParams} from 'wlc-engine/interfaces/config.interface';
import {IBurgerPanelCParams} from './../burger-panel/burger-panel.params';
import {IIndexing} from 'wlc-engine/interfaces/index';

export interface IFloatPanelsComponentParams extends IComponentParams <string, string, string> {
    /** Params for each panel by name */
    panels?: IIndexing<IBurgerPanelCParams>;
};

export interface IFloatPanelsComponentEvents {
    /** `PANEL_OPEN` event fires opening of panel */
    PANEL_OPEN: string;

    /** `PANEL_CLOSE` event fires closing of panel */
    PANEL_CLOSE: string,
};

export const defaultParams: IFloatPanelsComponentParams = {
    class: 'wlc-float-panels',
    panels: {
        left: {
            type: 'left',
        },
        right: {
            type: 'right',
        },
    },
};

export const panelsEvents: IFloatPanelsComponentEvents = {
    PANEL_OPEN: 'PANEL_OPEN',
    PANEL_CLOSE: 'PANEL_CLOSE',
};
