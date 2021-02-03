import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {FormControl} from '@angular/forms';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'toggle' | CustomType;
export type TextSide = 'left' | 'right';
export type CheckboxType ='terms' | 'age' | 'payment-rules';
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | TextSide | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export type OnChange = (checked: boolean) => void;

export interface ICheckboxCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name?: string;
    value?: string;
    checkboxType?: CheckboxType;
    validators?: ValidatorType[];
    text?: string;
    textSide?: TextSide;
    control?: FormControl;
    onChange?: OnChange,
    common?: {
        customModifiers?: CustomMod;
    }
    modifiers?: Modifiers[];
}

export const defaultParams: ICheckboxCParams = {
    class: 'wlc-checkbox',
};
