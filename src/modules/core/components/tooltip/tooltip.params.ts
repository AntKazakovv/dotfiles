import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';


export interface ITooltipCParams extends IComponentParams<unknown, unknown, unknown> {
    inlineText?: string;
    modal?: string;
    modalParams?: IIndexing<string>;
}

export const defaultParams: ITooltipCParams = {
    class: 'wlc-tooltip',
    inlineText: 'Info',
};
