import {IWrapperCParams} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type ThemeMod =
    'default' |
    /** simple mod - without content top border. Different colors also */
    'simple'
    | CustomType;

export type TAccordionTheme = 'default' | 'wolf' | CustomType;

export interface IAccordionData {
    /** Title item */
    title: string;
    /** Description/subtitle, shows under title */
    description?: string;
    /** Content item */
    content?: string[];
    /** Use it for showing another components inside accordion panel */
    wrapper?: IWrapperCParams;
    /** Expand item */
    expand?: boolean;
}
export interface IAccordionCParams extends IComponentParams<string, string, string> {
    themeMod?: ThemeMod;
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
    titleIconPath: '/wlc/icons/icons_new/arrow.svg',
};
