import {IActionParams} from 'wlc-engine/modules/core';

export type TInteractiveUseFor = 'all' | 'tournaments' | 'store';

export interface IInteractiveText {
    title?: string;
    text?: string;
    actionParams?: IActionParams;
    useFor?: TInteractiveUseFor,
}
