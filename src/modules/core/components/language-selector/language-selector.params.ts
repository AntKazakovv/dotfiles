import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';


export type ThemeType = 'default';
export type ThemeModType = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'long';
export type ComponentType = 'click' | 'hover' | 'compact';

export interface ICurrentLangCParams {
    hideFlag?: boolean;
    hideLang?: boolean;
    hideArrow?: boolean;
}

export interface ILanguageSelectorDropdownCParams {
    hideFlag?: boolean;
    hideLang?: boolean;
}

export interface ILanguageSelectorCParams extends IComponentParams<ThemeType, ComponentType, ThemeModType> {
    common?: {
        flags?: {
            path?: string;
            dim?: string;
            replace?: {
                [key: string]: string;
            };
        };
        scrollable?: boolean;
    };
    currentLang?: ICurrentLangCParams;
    dropdown?: ILanguageSelectorDropdownCParams;
    toggleOnScroll?: ThemeModType;
    /**
     *  Accepts language codes; Example: ['ru', 'en', 'pt-br'];
     */
    order?: string[];
    compactMod?: boolean;
    useTooltip?: boolean;
}

export const defaultParams: ILanguageSelectorCParams = {
    componentName: 'wlc-language-selector',
    moduleName: 'core',
    class: 'wlc-language-selector',
    themeMod: 'bottom-left',
    type: 'click',
    common: {
        flags: {
            path: '/gstatic/wlc/flags/1x1/',
            dim: 'svg',
            replace: {
                en: 'gb',
                zh: 'cn',
                'zh-hans': 'cn',
                'zh-hant': 'cn',
                'sp': 'es',
                'pt-br': 'pt',
                'da': 'dk',
                'sv': 'se',
            },
        },
    },
    wlcElement: 'block_language-selector',
    compactMod: false,
    useTooltip: false,
};
