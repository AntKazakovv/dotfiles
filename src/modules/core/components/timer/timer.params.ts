import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {DateTime} from 'luxon';

export type ModeType = 'default';
export type ComponentTheme = 'default' | 'one-line';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ThemeMod = 'default' | 'count-up' | 'light' | string;
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface ITimerCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    common?: {
        noCountDown?: boolean;
        value?: string | DateTime;
        text?: string;
        countUp?: boolean;
        noDays?: boolean;
        noHours?: boolean;
    };
    /** Acronyms for time units */
    acronyms?: {
        days?: string;
        hours?: string;
        minutes?: string;
        seconds?: string;
    };
    /** Dividers for time string */
    dividers?: {
        /** Define divider for time units */
        units?: string;
        /** Define divider between time unit value and it's acronym */
        text?: string;
    };
    /** Path to icon */
    iconPath?: string;
}

export const defaultParams: ITimerCParams = {
    class: 'wlc-timer',
    componentName: 'wlc-timer',
    moduleName: 'core',
    iconPath: '/wlc/icons/clock.svg',
    acronyms: {
        days: gettext('d'),
        hours: gettext('h'),
        minutes: gettext('m'),
        seconds: gettext('s'),
    },
    dividers: {
        units: ':',
        text: '',
    },
};
