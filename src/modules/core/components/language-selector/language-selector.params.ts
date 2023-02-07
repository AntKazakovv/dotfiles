import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';


export type ThemeType = 'default' | 'mobile-app';
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
    /** The approximate height of each element along with the space around. */
    itemLangHeight?: number,
    /** Count of languages ​​to display in dropdown. */
    countLangFromDropdown?: number,
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
                'da': 'dk',
                'sv': 'se',
            },
        },
    },
    itemLangHeight: 40,
    countLangFromDropdown: 6,
    wlcElement: 'block_language-selector',
    compactMod: false,
    useTooltip: false,
};
