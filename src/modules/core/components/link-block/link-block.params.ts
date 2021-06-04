import {RawParams} from '@uirouter/core';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ThemeMod = 'default' | 'secondary' | CustomType;

export interface ILinkBlockCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    themeMod?: ThemeMod;
    common?: {
        title?: string;
        subtitle?: string;
        link?: string;
        actionParams?: IActionParams;
        useInteractiveText?: boolean,
        useLinkButton?: boolean,
    };
}

export interface IActionParams {
    modal?: {
        name?: string,
    },
    url?: {
        path?: string,
        params?: RawParams,
    },
    event?: {
        name?: string,
    }
}

export const defaultParams: ILinkBlockCParams = {
    moduleName: 'core',
    componentName: 'wlc-link-block',
    class: 'wlc-link-block',
    common: {
        actionParams: {},
        useInteractiveText: false,
        useLinkButton: true,
    },
};
