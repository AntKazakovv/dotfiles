import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModeType = 'default';
export type ComponentTheme = 'default';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface ICopyrightCParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: ICopyrightCParams = {
    class: 'wlc-copyright',
    moduleName: 'core',
    componentName: 'wlc-copyright',
};
