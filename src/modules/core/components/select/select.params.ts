import {FormControl} from '@angular/forms';
import {CustomType, IComponentParams} from 'wlc-engine/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/services/validation/validation.service';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ISelectOptions {
    value: unknown;
    title: string;
}

export interface ISelectParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name?: string;
    value?: string;
    common?: {
        placeholder?: string;
    },
    options?: string;
    validators?: ValidatorType[];
    control?: FormControl;
    items?: unknown;
}

export const defaultParams: ISelectParams = {
    class: 'wlc-select',
};
