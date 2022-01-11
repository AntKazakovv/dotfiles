import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces';

export type ComponentTheme = 'default' | 'sticky' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IUserInfoButton {
    use?: boolean;
    sref?: string;
    text?: string;
}

export interface IUserInfoCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    dropdown: {
        components: ILayoutComponent[]
    }
    button?: IUserInfoButton,
}

export const defaultParams: IUserInfoCParams = {
    class: 'wlc-user-info',
    moduleName: 'user',
    componentName: 'wlc-user-info',
    wlcElement: 'block_user-stat',
    button: {
        use: true,
        sref: 'app.profile.cash.deposit',
        text: gettext('Deposit'),
    },
    dropdown: {
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-user-info__wrp',
                    components: [
                        {
                            name: 'user.wlc-user-name',
                        },
                        {
                            name: 'user.wlc-logout',
                        },
                    ],
                },
            },
            {
                name: 'user.wlc-user-stats',
            },
            {
                name: 'menu.wlc-profile-menu',
                params: {
                    theme: 'dropdown',
                    themeMod: 'vertical',
                    type: 'dropdown',
                    common: {
                        useArrow: true,
                    },
                },
            },
        ],
    },
};

export const stickyThemeParams: IUserInfoCParams = {
    class: 'wlc-user-info sticky',
    moduleName: 'user',
    componentName: 'wlc-user-info',
    wlcElement: 'block_user-stat',
    button: {
        use: true,
        sref: 'app.profile.cash.deposit',
        text: gettext('Deposit'),
    },
    dropdown: {
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-user-info__wrp sticky',
                    components: [
                        {
                            name: 'core.wlc-button',
                            params: {
                                class: 'wlc-btn wlc-btn-profile',
                                common: {
                                    iconPath: '/wlc/icons/user-icon.svg',
                                    text: gettext('My Profile'),
                                    sref: 'app.profile.dashboard',
                                },
                            },
                        },
                        {
                            name: 'user.wlc-logout',
                        },
                    ],
                },
            },
            {
                name: 'user.wlc-user-stats',
            },
        ],
    },
};
