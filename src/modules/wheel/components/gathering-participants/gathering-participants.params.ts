import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes';
import {ITimerCParams} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type ModeType = 'show' | 'create' | 'join';

export interface IDataWheel {
    amount?: string;
    currency?: string;
    duration?: string;
    finishedAt?: string;
}

export interface IGatheringParticipantsCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod>
{
    timerParams?: ITimerCParams;
    id?: number;
    isStreamer?: boolean;
    completionByButton?: boolean;
    dataWheel?: IDataWheel;
    serverTime?: number;
    nonce?: string;
    mode?: ModeType;
}

export const defaultParams: IGatheringParticipantsCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-gathering-participants',
    class: 'wlc-gathering-participants',
    isStreamer: false,
    completionByButton: false,
};

export const timerParams: ITimerCParams = {
    theme: 'circle',
    common: {
        noDays: true,
        noHours: true,
    },
    acronyms: {
        minutes: gettext('min'),
        seconds: gettext('sec'),
    },
    dividers: {
        units: ' ',
        text: ' ',
    },
};
