import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type ThemeMod = 'resolve' | 'error' | CustomType;

export interface ITooltipCParams extends IComponentParams<unknown, unknown, ThemeMod> {
    inlineText?: string;
    iconName?: string;
    modal?: string;
    modalParams?: IIndexing<string>;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    bsTooltipMod?: 'error' | string;
}

export const defaultParams: ITooltipCParams = {
    class: 'wlc-tooltip',
    inlineText: 'Info',
    iconName: 'info',
    placement: 'bottom',
};
