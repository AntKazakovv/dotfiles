import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type ModifiersType = string;
export type Theme = 'default' | 'footer';
export type ThemeMod = 'default';
export type Type = 'ring';

export interface ILoaderCParams extends IComponentParams<Theme, Type, ThemeMod> {
    common?: {
    };
}

export const defaultParams: ILoaderCParams = {
    moduleName: 'core',
    componentName: 'wlc-loader',
    class: 'wlc-loader',
    type: 'ring',
    common: {
    },
};
