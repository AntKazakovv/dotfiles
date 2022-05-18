import {FormControl} from '@angular/forms';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | 'button' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IRadioButtonsCParams<V = unknown> extends IComponentParams<Theme, Type, ThemeMod> {
    name: string;
    value?: V;
    common?: {
        placeholder?: string;
    },
    control?: FormControl;
    disabled?: boolean;
    locked?: boolean;
    items?: IRadioButtonOption<V>[];
    /** index of item */
    defaultValue?: number;
};

export interface IRadioButtonOption<V = unknown> {
    value: V;
    title: string;
};

export const defaultParams: Partial<IRadioButtonsCParams> = {
    class: 'wlc-radio-buttons',
    theme: 'button',
    defaultValue: 0,
};
