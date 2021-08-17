import {RawParams} from '@uirouter/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type TComponentTheme = 'default' | CustomType;
export type TComponentType = 'default' | CustomType;
export type TComponentThemeMod = 'default' | CustomType;

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
    },
    /*set link config, and where it should redirect*/
    link?: {
        useLink?: boolean,
        uiSref?: string,
        uiParams?: RawParams,
    },
    /*set background image of empty content*/
    bgImage?: string,
    /*set decor image of empty content*/
    decorImage?: string,
}

export const defaultParams: INoContentCParams = {
    moduleName: 'core',
    class: 'wlc-no-content',
    componentName: 'wlc-no-content',
    redirectBtn: {
        useBtn: true,
        sref: 'app.catalog',
        srefParams: {category: 'casino'},
    },
    link: {
        useLink: false,
        uiSref: 'app.catalog',
        uiParams: {category: 'casino'},
    },
};
