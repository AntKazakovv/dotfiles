import {FormControl} from '@angular/forms';
import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';

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
        usePasswordVisibilityDirective?: boolean;
    }
    validators?: ValidatorType[];
    control?: FormControl;
    exampleValue?: string;
    disabled?: boolean;
    locked?: boolean;
    modifiers?: Modifiers[];
}

export const defaultParams: Partial<IInputCParams> = {
    class: 'wlc-input',
    common: {
        type: 'text',
        usePasswordVisibilityDirective: false,
    },
};
