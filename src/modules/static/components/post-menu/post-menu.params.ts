import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export interface IPostMenuComponentParams extends IComponentParams<string, string, string> {
    categorySlug: string;
}

export type ModifiersType = string;

export interface ISPParams extends IComponentParams<string, string, string> {
    modifiers?: ModifiersType[];
    common?: {
    };
}

export const defaultParams: ISPParams = {
    class: 'wlc-post-menu',
    common: {
    },
};
