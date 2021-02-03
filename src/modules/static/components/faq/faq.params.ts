import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IFaqCParams extends IComponentParams<string, string, string> {
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

export const defaultParams: IFaqCParams = {
    class: 'wlc-faq',
    slug: 'partners-faq',
    common: {
    },
};
