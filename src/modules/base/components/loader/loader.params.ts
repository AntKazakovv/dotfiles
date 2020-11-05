import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export type ModifiersType = string;
export type Theme = 'default' | 'footer';
export type ThemeMod = 'default';
export type Type = 'ring';

export interface ILoaderComponentParams extends IComponentParams<Theme, Type, ThemeMod> {
    common?: {
    };
}

export const defaultParams: ILoaderComponentParams = {
    class: 'wlc-loader',
    type: 'ring',
    common: {
    },
};
