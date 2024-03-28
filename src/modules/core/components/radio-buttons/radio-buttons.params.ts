import {UntypedFormControl} from '@angular/forms';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';

export type Theme = 'default' | 'button' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | 'vertical' | CustomType;

export interface IRadioButtonsCParams<V = unknown> extends IComponentParams<Theme, Type, ThemeMod> {
    /**
     * Field name.
     * If items (options) contain inputs,
     * first element of array must be a name of radio-button,
     * other are names of item's inputs
     */
    name: string | string[];
    value?: V;
    common?: {
        placeholder?: string;
    },
    control?: UntypedFormControl;
    disabled?: boolean;
    locked?: boolean;
    items?: IRadioButtonOption<V>[];
    /** index of item */
    defaultValue?: number;
    validators?: ValidatorType[],
};

export interface IRadioButtonOption<V = unknown> {
    value: V;
    title: string;
    disabled?: boolean;
    /**
     *Input params. Works only with form wrapper which creates controls
     */
    input?: IInputCParams;
};

export const defaultParams: Partial<IRadioButtonsCParams> = {
    class: 'wlc-radio-buttons',
    theme: 'button',
    defaultValue: 0,
};
