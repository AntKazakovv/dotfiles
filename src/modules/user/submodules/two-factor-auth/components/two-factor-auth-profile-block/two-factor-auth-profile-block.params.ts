import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITwoFactorAuthProfileBlockCParams extends IComponentParams<Theme, Type, ThemeMod> {
}

export const defaultParams: Partial<ITwoFactorAuthProfileBlockCParams> = {
    moduleName: 'two-factor-auth',
    componentName: 'wlc-two-factor-auth-profile-block',
    class: 'wlc-two-factor-auth-profile-block',
};
