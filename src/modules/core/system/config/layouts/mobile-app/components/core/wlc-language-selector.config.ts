import {ILayoutComponent} from 'wlc-engine/modules/core';
import {
    ILanguageSelectorCParams,
} from 'wlc-engine/standalone/core/components/language-selector/language-selector.params';

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
            after: 900,
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
    export const bottomLeft2: ILayoutComponent = {
        name: 'core.wlc-language-selector',
        params: <ILanguageSelectorCParams>{
            themeMod: 'bottom-left',
            currentLang: {
                hideLang: true,
            },
            toggleOnScroll: null,
        },
        display: {
            after: 1200,
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
