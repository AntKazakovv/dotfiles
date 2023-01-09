import {
    CustomType,
    IComponentParams,
    IIndexing,
    ValidatorType,
} from 'wlc-engine/modules/core';
import {FormControl} from '@angular/forms';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'toggle' | CustomType;
export type TextSide = 'left' | 'right';
export type CheckboxType = 'terms' | 'age' | 'payment-rules' | 'privacy-policy' | 'legal-modal' | 'legal-link';
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | TextSide | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type OnChange = (checked: boolean) => void;
export type TargetType = '_blank' | '_self' | '_parent' | '_top';


export interface ILegalCheckboxWithLink {
    prefix?: string;
    linkText?: string;
    suffix?: string;
    slug?: string;
    /* Hook for url */
    urlHook?: string;
    /* new tab for clickable text (<a>)*/
    target?: TargetType;
}

export interface ICheckboxCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name?: string;
    value?: string;
    checkboxType?: CheckboxType;
    validators?: ValidatorType[];
    text?: string;
    textSide?: TextSide;
    /* for checkbox for legal rules with link inside */
    textWithLink?: ILegalCheckboxWithLink;
    /* context for text translate */
    textContext?: IIndexing<string | number>;
    control?: FormControl;
    onChange?: OnChange,
    common?: {
        customModifiers?: CustomMod;
        checkedDefault?: boolean;
    }
    modifiers?: Modifiers[];
}

export const defaultParams: ICheckboxCParams = {
    class: 'wlc-checkbox',
    moduleName: 'core',
    componentName: 'wlc-checkbox',
    common: {
        checkedDefault: false,
    },
};
