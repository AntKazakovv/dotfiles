import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type ThemeMod = 'resolve' | 'error' | CustomType;
export type ComponentType = 'wrapper' | CustomType;

export interface ITooltipCParams extends IComponentParams<unknown, ComponentType, ThemeMod> {
    inlineText?: string;
    iconName?: string;
    modal?: string;
    modalParams?: IIndexing<string>;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    bsTooltipMod?: 'error' | string;
}
