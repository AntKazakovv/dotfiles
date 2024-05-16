import {RawParams} from '@uirouter/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type TComponentTheme = 'default' | 'promotions' | CustomType;
export type TComponentType = 'default' | CustomType;
export type TComponentThemeMod = 'default' | CustomType;

export type TEvent = {
    name: string;
    data?: unknown;
}

export interface INoContentCParams extends IComponentParams<TComponentTheme, TComponentType, TComponentThemeMod> {
    /*describes in which component was used no-content component*/
    parentComponentClass?: string,
    /*set title of empty state*/
    title?: string,
    /*set text of empty state*/
    text?: string,
    /*set bnts config, and where it should redirect*/
    redirectBtn?: {
        useBtn?: boolean,
        sref?: string,
        srefParams?: RawParams,
        text?: string,
        event?: TEvent;
    },
    /*set link config, and where it should redirect*/
    link?: {
        useLink?: boolean,
        uiSref?: string,
        uiParams?: RawParams,
        event?: TEvent;
    },
    /*set background image of empty content*/
    bgImage?: string,
    /*set decor image of empty content*/
    decorImage?: string,
    decorParams?: {
        /** Params for using decor inside content block */
        useDecorInside?: boolean;
        /** use decor picture inline (for svg pictures only) */
        useInline?: boolean;
    },
}

export const defaultParams: INoContentCParams = {
    moduleName: 'core',
    class: 'wlc-no-content',
    componentName: 'wlc-no-content',
    redirectBtn: {
        useBtn: true,
        sref: 'app.catalog',
        srefParams: {category: 'casino'},
        text: gettext('Play'),
    },
    link: {
        useLink: false,
        uiSref: 'app.catalog',
        uiParams: {category: 'casino'},
    },
};
