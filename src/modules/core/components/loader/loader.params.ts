import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type ModifiersType = string;
export type Theme = 'default' | 'footer';
export type ThemeMod = 'default' | 'not-ready';
export type Type = 'ring' | 'logo' | 'ring-with-logo';

export interface ILoaderCParams extends IComponentParams<Theme, Type, ThemeMod> {
    common?: {
        logoPath?: string,
    };
}

export const defaultParams: ILoaderCParams = {
    moduleName: 'core',
    componentName: 'wlc-loader',
    class: 'wlc-loader',
    type: 'ring',
    common: {
        logoPath: 'logo.svg',
    },
};
