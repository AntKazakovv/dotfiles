import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModeType = 'default';
export type ComponentTheme = 'default';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface IDisclaimerParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    modifiers?: ModifiersType[];
    type?: ComponentType;
    theme?: ComponentTheme;
}

export const defaultParams: IDisclaimerParams = {
    class: 'wlc-disclaimer',
};
