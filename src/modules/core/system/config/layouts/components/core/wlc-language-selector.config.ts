import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ILanguageSelectorCParams} from 'wlc-engine/modules/core/components';

export namespace wlcLanguageSelector {
    export const topLeft: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: <ILanguageSelectorCParams>{
            themeMod: 'top-left',
            currentLang: {
                hideLang: false,
            },
            toggleOnScroll: 'bottom-left',
        },
        display: {
            after: 900,
        },
    };
    export const topLeftTheme2: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: <ILanguageSelectorCParams>{
            themeMod: 'top-left',
            currentLang: {
                hideLang: true,
            },
            toggleOnScroll: 'bottom-left',
        },
        display: {
            after: 1024,
        },
    };
    export const bottomLeft: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: <ILanguageSelectorCParams>{
            themeMod: 'bottom-left',
            currentLang: {
                hideLang: true,
            },
            toggleOnScroll: 'bottom-left',
        },
        display: {
            after: 900,
        },
    };
    export const long: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: <ILanguageSelectorCParams>{
            themeMod: 'long',
        },
    };
    export const footerThemeFirst: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: <ILanguageSelectorCParams>{
            themeMod: 'top-left',
            currentLang: {
                hideLang: false,
            },
            toggleOnScroll: 'bottom-left',
        },
    };
}
