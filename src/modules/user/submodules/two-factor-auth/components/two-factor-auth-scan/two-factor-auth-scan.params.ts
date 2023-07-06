import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {
    ITwoFactorAuthResponse,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/interfaces/two-factor-auth.interface';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITwoFactorAuthScanCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    subtitle?: string;
    description?: string;
    secretCode?: ITwoFactorAuthResponse;
}

export const defaultParams: ITwoFactorAuthScanCParams = {
    moduleName: 'two-factor-auth',
    componentName: 'wlc-two-factor-auth-scan',
    class: 'wlc-two-factor-auth-scan',
    title: gettext('Google Authenticator'),
    subtitle: gettext('Scan this QR code in the Authenticator app'),
    description: gettext('or enter this code manually into the app'),
};
