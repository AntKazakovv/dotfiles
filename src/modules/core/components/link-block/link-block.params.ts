import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ThemeMod = 'default' | 'secondary' | CustomType;

export interface ILinkBlockCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    themeMod?: ThemeMod;
    common?: {
        title?: string,
        subtitle?: string
        link?: string,
        actionParams?: IActionParams
    };
}

export interface IActionParams {
    modal?: {
        name: string,
    },
    url?: {
        path: string,
    },
    event?: {
        name: string,
    }
}

export const defaultParams: ILinkBlockCParams = {
    moduleName: 'core',
    componentName: 'wlc-link-block',
    class: 'wlc-link-block',
};
