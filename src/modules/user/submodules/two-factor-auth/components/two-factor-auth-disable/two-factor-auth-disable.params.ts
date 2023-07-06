import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITwoFactorAuthDisableCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    subtitle?: string;
    description?: string;
    message?: string;
}

export const defaultParams: ITwoFactorAuthDisableCParams = {
    moduleName: 'two-factor-auth',
    componentName: 'wlc-two-factor-auth-disable',
    class: 'wlc-two-factor-auth-disable',
    title: gettext('Confirmation'),
    subtitle: gettext('Disabling Google Authenticator two-factor authentication'),
    description: gettext(
        'The next login to the account will not require a code from ' +
        'the device and will be less secure.',
    ),
    message: gettext('Are you sure?'),
};
