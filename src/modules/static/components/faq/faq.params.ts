import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IFaqCParams extends IComponentParams<string, string, string> {
    /** slug WP post*/
    slug?: string;
    /** Icon to the right of the title */
    titleIconPath?: string;
    /** Collapse all items */
    collapseAll?: boolean;
    /** Title accordion */
    title?: string;
    /** @deprecated use props outside common */
    common?: {
        /** Collapse all items */
        collapseAll?: boolean;
        /** Title accordion */
        title?: string;
    }
}

export const defaultParams: IFaqCParams = {
    class: 'wlc-faq',
    slug: 'partners-faq',
    titleIconPath: '/wlc/icons/thin-arrow.svg',
    title: gettext('FAQ'),
};
