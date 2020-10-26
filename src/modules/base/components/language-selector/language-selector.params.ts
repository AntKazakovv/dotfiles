import {IComponentParams} from 'wlc-engine/classes/abstract.component';

export type ModeType = 'default' | 'hover';
export type ComponentTheme = 'default' | 'bordered';
export type ComponentType = 'default' | 'slide';
export type AutoModifiersType = ComponentTheme | ModeType | 'grid' | 'scrollable';
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface ILSParams extends IComponentParams<ComponentTheme, ComponentType> {
    modifiers?: ModifiersType[];
    type?: ComponentType;
    theme?: ComponentTheme;
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
    common: {
        flags: {
            path: '/gstatic/wlc/flags/1x1/',
            dim: 'svg',
            replace: {
                en: 'gb',
            },
        },
    },
};
