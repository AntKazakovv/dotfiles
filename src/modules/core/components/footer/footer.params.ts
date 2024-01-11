import {
    IComponentParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

export type ModeType = 'default';
export type ComponentTheme = 'default';
export type ThemeMode = 'default';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface IFooterCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMode> {
    config?: IWrapperCParams;
    container?: boolean;
}

export const defaultParams: IFooterCParams = {
    class: 'wlc-footer',
    moduleName: 'core',
    componentName: 'wlc-footer',
    theme: 'default',
    container: true,
    config: {
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'footer-menu',
                    wlcElement: 'block_footer-info',
                    components: [
                        componentLib.wlcPostMenu.footerInfo,
                    ],
                },
            },
            componentLib.wlcIconList.merchants,
            {
                name: 'icon-list.wlc-icon-payments-list',
                params: {
                    colorIconBg: 'dark',
                    iconsType: 'black',
                    iconComponentParams: {
                        themeMod: 'wolf',
                        watchForScroll: false,
                    },
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'footer-disclaimer',
                    id: 1,
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'footer-disclaimer__item',
                                components: [
                                    componentLib.wlcDisclaimer.def,
                                    componentLib.wlcRecaptchaPolicy.def,
                                ],
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'footer-bottom',
                    id: 1,
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'footer-bottom__left',
                                components: [
                                    {
                                        name: 'core.wlc-social-icons',
                                        params: {
                                            theme: 'wolf',
                                            themeMod: 'compact',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'footer-bottom__center',
                                components: [
                                    componentLib.wlcLogo.footerWolf,
                                ],
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'footer-bottom__right',
                                components: [
                                    componentLib.wlcLicense.def,
                                ],
                            },
                        },
                    ],
                },
            },
            componentLib.wlcCopyright.def,
            componentLib.wlcScrollUp.def,
        ],
    },
};
