import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IAccordionData {
    /** Title item */
    title: string;
    /** Content item */
    content: string[];
    /** Expand item */
    expand?: boolean;
}
export interface IAccordionCParams extends IComponentParams<string, string, string> {
    /** Accordion item */
    items?: IAccordionData[];
    /** Collapse all items */
    collapseAll?: boolean;
    /** Title accordion */
    title?: string;
    /** Icon to the right of the title */
    titleIconPath?: string;
    /** Text before accordion */
    textBefore?: string[];
    /** Text after accordion */
    textAfter?: string[];
    /** Is there any content */
    isEmpty?: boolean;
}

export const defaultParams: IAccordionCParams = {
    class: 'wlc-accordion',
    moduleName: 'core',
    titleIconPath: '/wlc/icons/thin-arrow.svg',
};
