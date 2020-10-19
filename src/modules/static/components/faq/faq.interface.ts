import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export interface IFaqComponentParams extends IComponentParams {
    slug: string;
    collapseAll: boolean;
    showErrors?: boolean;
}

export interface IFaqData {
    title: string;
    content: string;
    expand: boolean;
}
