import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';


export type ThemeType = 'default';
export type ThemeModType = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'long';
export type ComponentType = 'click' | 'hover';

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
    currentLang?: {
        hideFlag?: boolean;
        hideLang?: boolean;
        hideArrow?: boolean;
    };
    dropdown?: {
        hideFlag?: boolean;
        hideLang?: boolean;
    };
    toggleOnScroll?: ThemeModType;
}

export const defaultParams: ILanguageSelectorCParams = {
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
            },
        },
    },
    wlcElement: 'block_language-selector',
};
