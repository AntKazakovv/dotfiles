import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModeType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export type LicenseType = 'apg' | 'mga' | 'curacao' | 'curacao-icon';

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
    /**
     * use curacao shield icon
     * if true, then use '//agstatic.com/wlc/icons/curacao-egaming-logo.png' as image
     */
    icon?: string | true;
    /**
     * add to shield icon link to pdf certificate
     * if true, then use '/static/curacao_license.pdf' in link
     */
    pdf?: string | true;
}

export interface ILicenseCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    apgSeal?: IApgSealConfig;
    mga?: IMGAConfig;
    curacao?: ICuracaoConfig;
    iconPathAge?: string;
}

export const defaultParams: ILicenseCParams = {
    class: 'wlc-license',
    moduleName: 'core',
    componentName: 'wlc-license',
    iconPathAge: '/wlc/icons/age-restrictions-18.svg',
};
