import {TransitionOptions} from '@uirouter/core';
import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export interface IParams extends IComponentParams<string, string, string> {
    link: string;
    uiOptions?: TransitionOptions;
    disableLink?: boolean;
    image?: {
        name?: string;
        url?: string;
    };
}

export const defaultParams: IParams = {
    class: 'wlc-logo',
    link: 'app.home',
    uiOptions: {
        reload: true,
        inherit: true,
    },
    disableLink: false,
    image: {
        url: 'wlc/icons/default-logo.svg',
    },
};
