import {FormControl} from '@angular/forms';
import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {IIndexing} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'vertical' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISelectCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    value?: string;
    common?: {
        placeholder?: string;
        customModifiers?: CustomMod;
        tooltipText?: string;
        tooltipModal?: string;
        tooltipModalParams?: IIndexing<string>;
    },
    validators?: ValidatorType[];
    control?: FormControl;
    disabled?: boolean;
    locked?: boolean;
    labelText?: string;
    options?: string;
    items?: ISelectOptions[];
    modifiers?: Modifiers[];
}

export interface ISelectOptions {
    value: unknown;
    title: string | number;
}

export const defaultParams: Partial<ISelectCParams> = {
    class: 'wlc-select',
};
