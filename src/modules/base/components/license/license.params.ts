import {IComponentParams, CustomType} from 'wlc-engine/classes/abstract.component';

export type ModeType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface IApgSealConfig {
    sealId: string;
    sealDomain: string;
}

export interface IApgSealCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    apgSeal?: IApgSealConfig;
}

export const defaultParams: IApgSealCParams = {
    class: 'wlc-license',
};
