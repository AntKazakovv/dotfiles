import {IAlertCParams} from 'wlc-engine/modules/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | 'wolf' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IShuftiProKycamlCParams extends IComponentParams<Theme, Type, ThemeMod> {
    alertParams: IAlertCParams;
}

export const defaultParams: IShuftiProKycamlCParams = {
    moduleName: 'profile',
    componentName: 'wlc-shufti-pro-kycaml',
    class: 'wlc-shufti-pro-kycaml',
    alertParams: {
        theme: 'default',
        level: 'warning',
    },
};
