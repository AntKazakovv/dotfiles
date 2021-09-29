import {FormControl} from '@angular/forms';
import IMask from 'imask';
import {
    CustomType,
    IComponentParams,
    ValidatorType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {ThemeMod as TooltipThemeMod} from 'wlc-engine/modules/core/components/tooltip/tooltip.params';

export type ComponentTheme = 'default'| 'placeholder-shown' | 'vertical' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

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
    }
    validators?: ValidatorType[];
    control?: FormControl;
    exampleValue?: string;
    disabled?: boolean;
    locked?: boolean;
    modifiers?: Modifiers[];
    icon?: string;
    clipboard?: boolean;
    showCurrency?: boolean;
    prohibitedPattern?: RegExp;
    maskOptions?: IMask.AnyMaskedOptions | string;
}

export const defaultParams: Partial<IInputCParams> = {
    class: 'wlc-input',
    common: {
        type: 'text',
        usePasswordVisibilityBtn: false,
        useLabel: true,
    },
};
