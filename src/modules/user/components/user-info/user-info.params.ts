import {
    CustomType,
    IComponentParams,
    TButtonAnimation,
    ILayoutComponent,
} from 'wlc-engine/modules/core';
import {IUserStatsCParams} from 'wlc-engine/modules/user/components/user-stats/user-stats.params';

export type ComponentTheme = 'default' | 'sticky' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IUserInfoButton {
    use?: boolean;
    sref?: string;
    text?: string;
    animate?: TButtonAnimation;
}

export interface IUserInfoCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    dropdown: {
        components: ILayoutComponent[]
    }
    button?: IUserInfoButton,
    userStatsParams?: IUserStatsCParams,
}

export const defaultParams: IUserInfoCParams = {
    class: 'wlc-user-info',
    moduleName: 'user',
    componentName: 'wlc-user-info',
    wlcElement: 'block_user-stat',
    userStatsParams: {
        type: 'short',
    },
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
    userStatsParams: {
        type: 'short',
    },
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
                            name: 'user.wlc-user-icon',
                            params: {
                                showAsBtn: true,
                                class: 'wlc-btn-profile',
                                buttonParams: {
                                    common: {
                                        text: gettext('My Profile'),
                                        sref: 'app.profile.dashboard',
                                    },
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

export const kioskParams: IUserInfoCParams = {
    class: 'wlc-user-info',
    moduleName: 'user',
    componentName: 'wlc-user-info',
    wlcElement: 'block_user-stat',
    userStatsParams: {
        type: 'short',
    },
    button: {
        use: false,
    },
    dropdown: {
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-user-info__wrp',
                    components: [
                        {
                            name: 'user.wlc-user-icon',
                            params: {
                                showAsBtn: true,
                                class: 'wlc-btn-profile',
                                buttonParams: {
                                    common: {
                                        text: gettext('My Profile'),
                                        sref: 'app.profile.main.info',
                                    },
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

export const internalMailsNotifierConfig = {
    components: [
        {name: 'internal-mails.wlc-internal-mails-notifier'},
    ],
};
