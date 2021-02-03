import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type ModifiersType = string;
export type Theme = 'default' | 'footer';
export type ThemeMod = 'default' | 'footer-info' | 'footer-about';
export type Type = 'default';

export interface IBasePath {
    url: string;
    addLanguage?: boolean;
    page?: string;
}

export interface IPostMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: ModifiersType[];
    common?: {
        categorySlug?: string;
        title?: string;
        basePath?: IBasePath;
    };
}

export const defaultParams: IPostMenuCParams = {
    class: 'wlc-post-menu',
    common: {
    },
};
