import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export type LinkType = {
    title: string,
    state: string,
    params?: IIndexing<string>
}

export interface IErrorPageCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
    }
    links?: LinkType[],
}

export const defaultParams: IErrorPageCParams = {
    moduleName: 'core',
    componentName: 'wlc-error-page',
    class: 'wlc-error-page',
    links: [
        {
            title: gettext('Casino'),
            state: 'app.catalog',
            params: {
                category: 'casino',
            },
        },
        {
            title: gettext('Live Casino'),
            state: 'app.catalog',
            params: {
                category: 'live',
            },
        },
    ],
};
