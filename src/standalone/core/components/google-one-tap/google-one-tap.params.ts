import {IComponentParams} from 'wlc-engine/modules/core';
import {
    ComponentTheme,
    ComponentType,
} from 'wlc-engine/modules/user/components/add-profile-info';

export interface IGoogleOneTapCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    loginUri: string;
    otScriptUrl: string;
};

export const defaultParams: IGoogleOneTapCParams = {
    moduleName: 'core',
    componentName: 'wlc-google-one-tap',
    class: 'wlc-google-one-tap',
    loginUri: '/api/v1/auth/social/oauth_cb/ot',
    otScriptUrl: 'https://accounts.google.com/gsi/client',
};
