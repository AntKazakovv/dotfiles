import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSocial {
    export const socialNetworksRegister: ILayoutComponent = {
        name: 'user.wlc-social-networks',
    };

    export const socialNetworksProfile: ILayoutComponent = {
        name: 'user.wlc-social-networks',
        params: {
            theme: 'profile',
            titlePrefix: '',
        },
    };
};
