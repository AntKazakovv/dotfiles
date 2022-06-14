import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | 'fullscreen-game-frame' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export type TButtonsType = 'default' | 'resizable';

export interface IMerchantWalletPreviewCParams extends
    IComponentParams<Theme, Type, ThemeMod> {
    common?: {
        buttons?: {
            type?: TButtonsType;
        },
    },
};

export const defaultParams: IMerchantWalletPreviewCParams = {
    class: 'wlc-merchant-wallet-preview',
    componentName: 'wlc-merchant-wallet-preview',
    moduleName: 'games',
    common: {
        buttons: {
            type: 'default',
        },
    },
};

export const buttonsDefault: IWrapperCParams = {
    components: [
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: 'Add',
                },
                theme: 'default',
                themeMod: 'default',
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: 'Withdraw',
                },
                theme: 'default',
                themeMod: 'secondary',
            },
        },
    ],
};

export const buttonsResizable: IWrapperCParams = {
    components: [
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: 'Add',
                    iconPath: '',
                },
                theme: 'default',
                themeMod: 'default',
            },
            display: {
                after: 1024,
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: 'Withdraw',
                },
                theme: 'default',
                themeMod: 'secondary',
            },
            display: {
                after: 1024,
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    iconPath: '/wlc/icons/deposit-icon.svg',
                    text: '',
                },
                theme: 'cleared',
                customMod: 'mini',
            },
            display: {
                before: 1024,
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    iconPath: '/wlc/icons/withdraw-icon.svg',
                },
                theme: 'cleared',
                customMod: 'mini',
            },
            display: {
                before: 1024,
            },
        },
    ],
};
