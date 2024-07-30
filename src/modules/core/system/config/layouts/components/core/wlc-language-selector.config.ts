import {ILayoutComponent} from 'wlc-engine/modules/core';
import {
    ILanguageSelectorCParams,
} from 'wlc-engine/standalone/core/components/language-selector/language-selector.params';

export namespace wlcLanguageSelector {
    export const topLeft: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                themeMod: 'top-left',
                currentLang: {
                    hideLang: false,
                },
                toggleOnScroll: 'bottom-left',
            },
        },
        display: {
            after: 900,
        },
    };
    export const topLeftTheme2: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                themeMod: 'top-left',
                currentLang: {
                    hideLang: true,
                },
                toggleOnScroll: 'bottom-left',
            },
        },
        display: {
            after: 900,
        },
    };
    export const bottomLeft: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                themeMod: 'bottom-left',
                currentLang: {
                    hideLang: true,
                    hideArrow: true,
                },
                toggleOnScroll: 'bottom-left',
            },
        },
        display: {
            after: 900,
        },
    };
    export const bottomLeft2: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                themeMod: 'bottom-left',
                currentLang: {
                    hideLang: true,
                },
                toggleOnScroll: null,
            },
        },
        display: {
            after: 1200,
        },
    };
    export const long: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                themeMod: 'long',
                outsideClickHandler: false,
            },
        },
    };

    export const longCompact: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                themeMod: 'long',
                compactMod: true,
                outsideClickHandler: false,
            },
        },
    };

    export const menuThemeWolf: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                theme: 'wolf',
                compactMod: true,
                defaultIcon: 'wlc/icons/european/v3/language.svg',
                outsideClickHandler: false,
            },
        },
    };

    export const footerThemeFirst: ILayoutComponent = {
        name: 'core.wlc-sa',
        params: {
            saName: 'wlc-language-selector',
            saParams: <ILanguageSelectorCParams>{
                themeMod: 'top-left',
                currentLang: {
                    hideLang: false,
                },
                toggleOnScroll: 'bottom-left',
            },
        },
    };
}
