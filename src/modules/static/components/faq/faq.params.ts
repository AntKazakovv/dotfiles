import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export interface IFaqComponentParams extends IComponentParams<string, string, string> {
    slug?: string;
    common?: {
        collapseAll?: boolean;
        showErrors?: boolean;
        title?: string;
    }
}

export interface IFaqData {
    title: string;
    content: string;
    expand: boolean;
}

export const defaultParams: IFaqComponentParams = {
    class: 'wlc-faq',
    slug: 'partners-faq',
    common: {
    },
};
