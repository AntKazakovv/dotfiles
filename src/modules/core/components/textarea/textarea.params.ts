import {FormControl} from '@angular/forms';
import {
    CustomType,
    IComponentParams,
    ValidatorType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'placeholder-shown' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'feedback-form' | CustomType;

export interface ITextareaCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    name: string;
    value?: string;
    id?: string;
    common: {
        placeholder?: string;
        maxlength?: number;
    }
    exampleValue?: string;
    validators?: ValidatorType[];
    control?: FormControl;
}

export const defaultParams: Partial<ITextareaCParams> = {
    class: 'wlc-textarea',
    common: {},
};
