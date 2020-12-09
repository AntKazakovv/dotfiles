import {FormControl} from '@angular/forms';
import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {BehaviorSubject} from 'rxjs';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ISelectParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    value?: string;
    common?: {
        placeholder?: string;
    },
    validators?: ValidatorType[];
    control?: FormControl;
    disabled?: boolean;
    locked?: boolean;

    options?: string;
    items?: ISelectOptions[];
}

export interface ISelectOptions {
    value: unknown;
    title: string;
}

export const defaultParams: Partial<ISelectParams> = {
    class: 'wlc-select',
};
