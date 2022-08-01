import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBetPreviewParams extends IComponentParams<Theme, Type, ThemeMod> {
    bet?: IBet;
}

export const defaultParams: IBetPreviewParams = {
    class: 'wlc-bet-preview',
};
