import {UntypedFormControl} from '@angular/forms';
import IMask from 'imask';
import {
    CustomType,
    IComponentParams,
    ValidatorType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {ThemeMod as TooltipThemeMod} from 'wlc-engine/modules/core/components/tooltip/tooltip.params';

export type ComponentTheme = 'default' | 'placeholder-shown' | 'vertical' | 'mobile-app' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

/**
 * Settings for handling input value as a number.
 */
export interface INumericInputOptions {
    /**
     * Will the settings be enabled or not.
     * No other setting will work without defining it as `true`
     */
    use: boolean;
    /**
     * Restricts using minus sign ('-') and therefore negative numbers.
     */
    unsignedOnly?: boolean;
    /**
     * Max count of digits after radix.
     */
    scale?: number;
    /**
     * Resctricts using radix before any digit.
     */
    prohibitRadixAsFirst?: boolean;
}

export interface IInputCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    value?: string;
    id?: string;
    common: {
        placeholder?: string;
        separateLabel?: string;
        type?: string;
        customModifiers?: CustomMod;
        usePasswordVisibilityBtn?: boolean;
        useLabel?: boolean;
        readonly?: boolean;
        tooltipText?: string;
        tooltipIcon?: string;
        tooltipMod?: TooltipThemeMod;
        tooltipModal?: string;
        tooltipModalParams?: IIndexing<string>;
        autocomplete?: string;
        fixAutoCompleteForm?: boolean;
        maxLength?: number;
    }
    validators?: ValidatorType[];
    control?: UntypedFormControl;
    exampleValue?: string;
    disabled?: boolean;
    locked?: boolean;
    modifiers?: Modifiers[];
    icon?: string;
    clipboard?: boolean;
    showCurrency?: boolean;
    prohibitedPattern?: RegExp;
    /** @deprecated Use the global validator. Method left for backward compatibility */
    maskOptions?: IMask.AnyMaskedOptions | string;
    numeric?: INumericInputOptions,
    isHidden?: () => boolean;
}

export const defaultParams: Partial<IInputCParams> = {
    class: 'wlc-input',
    common: {
        type: 'text',
        usePasswordVisibilityBtn: false,
        useLabel: true,
        fixAutoCompleteForm: true,
    },
};
