import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBetradarDailyMatchCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        title?: string;
        openMatchText?: string;
    },
}

export const defaultParams: IBetradarDailyMatchCParams = {
    moduleName: 'sportsbook',
    componentName: 'wlc-betradar-daily-match',
    class: 'wlc-betradar-daily-match',
    theme: 'default',
    themeMod: 'default',
    common: {
        title: gettext('Match of the day'),
        openMatchText: gettext('See match online'),
    },
};
