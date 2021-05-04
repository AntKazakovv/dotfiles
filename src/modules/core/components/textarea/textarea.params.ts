import {FormControl} from '@angular/forms';
import {
    CustomType,
    IComponentParams,
    ValidatorType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;


export interface ITextareaCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    value?: string;
    placeholder?: string;
    validators?: ValidatorType[];
    control?: FormControl;
}

export const defaultParams: Partial<ITextareaCParams> = {
    class: 'wlc-textarea',
};
