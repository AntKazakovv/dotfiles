import {BehaviorSubject} from 'rxjs';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | 'modal' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type TagType = 'div' | 'h1' | 'h2' | 'span' | CustomType;

export type varTextType = 'mainText' | 'secondText';

export interface ITableCommonParams {
    indexShift?: number;
    noItemsText?: string;
}

export type TextType = string | BehaviorSubject<string>;

export interface ITitleCParams extends IComponentParams<Theme, Type, ThemeMod>, ITableCommonParams {
    mainText?: TextType,
    secondText?: TextType,
    common?: {
        mainTag?: TagType,
        secondTag?: TagType,
    },
}

export const defaultParams: ITitleCParams = {
    class: 'wlc-title',
    common: {
        mainTag: 'div',
        secondTag: 'div',
    },
};
