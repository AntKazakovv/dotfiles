import {
    CustomType,
    IComponentParams,
    IIndexing,
    ValidatorType,
} from 'wlc-engine/modules/core';
import {UntypedFormControl} from '@angular/forms';

export type ComponentTheme = 'default' | 'mobile-app' | 'toggle' | CustomType;
export type ComponentType = 'default' | CustomType;
export type TextSide = 'left' | 'right';
export type CheckboxType = 'terms' | 'age' | 'payment-rules' | 'privacy-policy' | 'legal-modal' | 'legal-link';
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | TextSide | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type OnChange = (checked: boolean) => void;
export type TargetType = '_blank' | '_self' | '_parent' | '_top';
export type TComponentThemeMod = 'default' | 'bg-transparent' | 'align-top' | 'bold' | CustomType;


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

export interface ICheckboxCParams extends IComponentParams<ComponentTheme, ComponentType, TComponentThemeMod> {
    name?: string;
    value?: boolean;
    checkboxType?: CheckboxType;
    validators?: ValidatorType[];
    text?: string;
    iconPath?: string;
    textSide?: TextSide;
    /* for checkbox for legal rules with link inside */
    textWithLink?: ILegalCheckboxWithLink;
    /* context for text translate */
    textContext?: IIndexing<string | number>;
    control?: UntypedFormControl;
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
    iconPath: '/wlc/icons/icons_new/tick.svg',
    common: {
        checkedDefault: false,
    },
};
