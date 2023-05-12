import {IModalParams} from 'wlc-engine/modules/core';

export interface IPopupModalItem {
    config: IModalParams,
    /**
     * Visibility by authentication:
     * true - for authorized user only,
     * false - for unauthorized user only,
     * undefined - always.
     */
    auth?: boolean | undefined;
}

export interface IPopupModalConfig {
    [key: string]: IPopupModalItem;
}

export interface IPopupConfig {
    use: boolean;
    modals?: IPopupModalConfig;
}
