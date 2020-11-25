import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export type ModifiersType = string;
export type Theme = 'default' | 'footer';
export type ThemeMod = 'default';
export type Type = 'ring';

export interface ILoaderCParams extends IComponentParams<Theme, Type, ThemeMod> {
    common?: {
    };
}

export const defaultParams: ILoaderCParams = {
    class: 'wlc-loader',
    type: 'ring',
    common: {
    },
};
