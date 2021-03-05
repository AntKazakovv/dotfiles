import {FormControl} from '@angular/forms';
import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {IMaskOptions} from 'wlc-engine/modules/core/directives/input-mask.directive';

export type ComponentTheme = 'default'| 'placeholder-shown' | 'vertical' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IInputCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    value?: string;
    common: {
        placeholder?: string;
        type?: string;
        customModifiers?: CustomMod;
        usePasswordVisibilityBtn?: boolean;
        useLabel?: boolean;
        readonly?: boolean;
        tooltipText?: string;
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
    currency?: boolean;
    prohibitedPattern?: RegExp;
    maskOptions?: IMaskOptions;
}

export const defaultParams: Partial<IInputCParams> = {
    class: 'wlc-input',
    common: {
        type: 'text',
        usePasswordVisibilityBtn: false,
        useLabel: true,
        autocomplete: 'off',
    },
};
