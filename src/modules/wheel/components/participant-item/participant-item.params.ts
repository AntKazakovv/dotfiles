import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {ParticipantModel} from 'wlc-engine/modules/wheel/system/models';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'winner' | 'default' | CustomType;
export type ComponentThemeMod = 'winner' |'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IParticipantItemCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    modifiers?: Modifiers[];
    participant?: ParticipantModel,
}

export const defaultParams: IParticipantItemCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-participant-item',
    class: 'wlc-participant-item',
    themeMod: 'default',
};
