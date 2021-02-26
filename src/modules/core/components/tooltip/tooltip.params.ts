import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';


export interface ITooltipCParams extends IComponentParams<unknown, unknown, unknown> {
    inlineText: string;
}

export const defaultParams: ITooltipCParams = {
    class: 'wlc-tooltip',
    inlineText: 'Info',
};
