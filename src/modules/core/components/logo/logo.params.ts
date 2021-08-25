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
        // if true, svg will be shown as image
        showSvgAsImg?: boolean;
        url?: string;
        // if there is value, it will be used as second logo on alt site theme
        urlForAltImg?: string;
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
        url: 'logo.svg',
        showSvgAsImg: false,
    },
    moduleName: 'core',
    componentName: 'wlc-logo',
    target: '_self',
};
