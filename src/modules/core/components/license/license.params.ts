import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModeType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export type LicenseType = 'apg' | 'mga' | 'curacao';

export interface IApgSealConfig {
    sealId: string;
    sealDomain: string;
}

export interface IMGAConfig {
    companyId: string;
}

export interface ICuracaoConfig {
    code: string;
    url?: string;
}

export interface ILicenseCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    apgSeal?: IApgSealConfig;
    mga?: IMGAConfig;
    curacao?: ICuracaoConfig;
}

export const defaultParams: ILicenseCParams = {
    class: 'wlc-license',
    moduleName: 'core',
    componentName: 'wlc-license',
};
