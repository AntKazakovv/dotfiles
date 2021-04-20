import {TransitionOptions} from '@uirouter/core';
import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface ILogoCParams extends IComponentParams<string, string, string> {
    link: string;
    uiOptions?: TransitionOptions;
    disableLink?: boolean;
    image?: {
        name?: string;
        url?: string;
    };
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
};
