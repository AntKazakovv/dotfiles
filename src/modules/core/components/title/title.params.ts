import {BehaviorSubject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type Theme = 'default' | CustomType;
export type Type = 'default' | 'modal' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type TagType = 'div' | 'h1' | 'h2' | 'span' | CustomType;

export type varTextType = 'mainText' | 'secondText';

export type TextType = string | BehaviorSubject<string>;

export interface ITitleCParams extends IComponentParams<Theme, Type, ThemeMod> {
    mainText?: TextType,
    secondText?: TextType,
    indexShift?: number;
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
