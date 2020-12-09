import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {FormControl} from '@angular/forms';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ICheckboxCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name?: string;
    value?: string;
    checkboxType: 'terms' | 'age';
    validators?: ValidatorType[];
    control?: FormControl;
}

export const defaultParams: ICheckboxCParams = {
    class: 'wlc-checkbox',
    checkboxType: 'terms',
};
