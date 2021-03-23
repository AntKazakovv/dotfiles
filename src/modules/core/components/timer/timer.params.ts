import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {DateTime} from 'luxon';

export type ModeType = 'default';
export type ComponentTheme = 'default';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ThemeMod = 'default' | 'count-up' | string;
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface ITimerCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    common?: {
        noCountDown?: boolean;
        value?: string | DateTime;
        text?: string;
        countUp?: boolean;
        noDays?: boolean;
    };
}

export const defaultParams: ITimerCParams = {
    class: 'wlc-timer',
};
