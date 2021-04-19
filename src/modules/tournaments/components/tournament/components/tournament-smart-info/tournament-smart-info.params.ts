import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {Tournament} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentSmartInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: ComponentTheme;
    type?: ComponentType;
    common?: {
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        tournament?: Tournament;
        type?: ComponentType;
        timerTextAfterStart?: string,
        timerTextBeforeStart?: string,
        prizePoolText?: string,
    };
}

export const defaultParams: ITournamentSmartInfoCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-smart-info',
    componentName: 'wlc-tournament-smart-info',
    common: {
        timerTextAfterStart: gettext('Time remaining'),
        timerTextBeforeStart: gettext('Coming soon'),
        prizePoolText: gettext('Prize pool'),
    },
};
