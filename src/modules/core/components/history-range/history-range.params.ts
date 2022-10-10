import {IHistoryDefault} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IHistoryRangeCParams extends IComponentParams<Theme, Type, ThemeMod> {
    historyType: keyof IHistoryDefault;
}

export const defaultParams: Partial<IHistoryRangeCParams> = {
    class: 'wlc-history-range',
};
