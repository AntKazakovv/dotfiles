import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export type ModifiersType = string;
export type Theme = 'default' | 'footer';
export type ThemeMod = 'default' | 'footer-info' | 'footer-about';
export type Type = 'default';

export interface IPostMenuComponentParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: ModifiersType[];
    common?: {
        categorySlug?: string;
        title?: string;
    };
}

export const defaultParams: IPostMenuComponentParams = {
    class: 'wlc-post-menu',
    common: {
    },
};
