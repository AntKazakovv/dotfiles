import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace header {
    export const def: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const defFixedPanel: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'universal',
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'header__left',
                    components: [
                        componentLib.wlcButton.burgerMobileFixedPanel,
                        componentLib.wlcLogo.header,
                    ],
                },
            },
            componentLib.wlcMainMenu.header,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'header__right',
                    components: [
                        componentLib.wlcLoginSignup.header,
                        componentLib.wlcUserInfo.header,
                        componentLib.wlcButton.userDepositIcon,
                        componentLib.wlcButton.searchV2,
                        componentLib.wlcButton.signup,
                    ],
                },
            },
        ],
    };

    export const defThemeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        modifiers: ['theme-toggler'],
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcThemeToggler.vertical,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2WithMobileLoginBtn: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['with-login-btn'],
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.mobileLoginBtn,
        ],
    };

    export const theme2WithLogoSmall: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['with-balance-info'],
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.headerDesktopOnly,
            componentLib.wlcLogo.headerLogoSmall,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcUserStats.mobile,
            componentLib.wlcButton.userIconMobile,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.mobileLoginBtnV2,
            componentLib.wlcButton.mobileSignupBtn,
        ],
    };

    export const theme2WithDoubleHeader: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['with-balance-info', 'with-top-logo'],
        components: [
            {
                name: 'core.wlc-wrapper',
                display: {
                    before: 767,
                },
                params: {
                    class: 'wlc-logo__wrapper',
                    components: [componentLib.wlcLogo.header],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'container',
                    components: [
                        componentLib.wlcButton.burger,
                        componentLib.wlcLogo.headerTabletOnly,
                        componentLib.wlcMainMenu.header,
                        componentLib.wlcLoginSignup.header,
                        componentLib.wlcUserInfo.header,
                        componentLib.wlcUserStats.mobile,
                        componentLib.wlcButton.userIconMobile,
                        componentLib.wlcLanguageSelector.bottomLeft2,
                        componentLib.wlcButton.searchV2,
                        componentLib.wlcButton.mobileLoginBtnV2,
                        componentLib.wlcButton.mobileSignupBtn,
                    ],
                },
            },
        ],
    };

    export const theme2themeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['theme-toggler'],
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcThemeToggler.vertical,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2withoutBurger: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['without-burger'],
        container: true,
        components: [
            componentLib.wlcButton.burgerMobile,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2withoutBurgerThemeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['without-burger', 'theme-toggler'],
        container: true,
        components: [
            componentLib.wlcButton.burgerMobile,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcThemeToggler.vertical,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const aff: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcButton.affLogin,
        ],
    };

    export const kiosk: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        modifiers: ['kiosk'],
        container: true,
        components: [
            componentLib.wlcButton.burgerMobile,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcButton.kioskLogin,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userIconKiosk,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.mobileKioskLogin,
        ],
    };
}
