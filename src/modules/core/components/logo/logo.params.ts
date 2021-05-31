import {RawParams, TransitionOptions} from '@uirouter/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentType= 'default' | 'affiliate' | CustomType;
export interface ILogoCParams extends IComponentParams<string, ComponentType, string> {
    link: string;
    uiOptions?: TransitionOptions;
    uiParams?: RawParams;
    disableLink?: boolean;
    image?: {
        name?: string;
        url?: string;
    };
    target?: '_self' | '_blank';
}

export const defaultParams: ILogoCParams = {
    class: 'wlc-logo',
    link: 'app.home',
    wlcElement: 'block_logo',
    uiOptions: {
        reload: false,
        inherit: true,
    },
    disableLink: false,
    image: {
        name: 'defaultLogo',
    },
    moduleName: 'core',
    componentName: 'wlc-logo',
    target: '_self',
};
