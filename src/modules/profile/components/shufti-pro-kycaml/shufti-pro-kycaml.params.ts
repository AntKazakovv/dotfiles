import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IShuftiProKycamlCParams extends IComponentParams<Theme, Type, ThemeMod> {
}

export const defaultParams: IShuftiProKycamlCParams = {
    moduleName: 'profile',
    componentName: 'wlc-shufti-pro-kycaml',
    class: 'wlc-shufti-pro-kycaml',
};
