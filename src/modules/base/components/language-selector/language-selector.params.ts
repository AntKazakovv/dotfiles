import {IComponentParams} from 'wlc-engine/classes/abstract.component';

export type ModeType = 'click' | 'hover';
export type ThemeType = null | 'bordered';
export type AutoModifiersType = ThemeType | ModeType | 'grid-3' | 'grid-4' | 'grid-5' | 'scrollable';
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface ILSParams extends IComponentParams {
    modifiers?: ModifiersType[];
    theme?: ThemeType;
    common?: {
        flags?: {
            path?: string;
            dim?: string;
            replace?: {
                [key: string]: string;
            };
        };
        mode?: ModeType;
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
}

export const defaultParams: ILSParams = {
    class: 'wlc-language-selector',
    theme: null,
    common: {
        flags: {
            path: '/gstatic/wlc/flags/1x1/',
            dim: 'svg',
            replace: {
                en: 'gb',
            },
        },
        mode: 'click',
    },
};
