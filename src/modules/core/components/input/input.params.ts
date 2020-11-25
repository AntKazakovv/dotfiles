import {FormControl} from '@angular/forms';
import {CustomType, IComponentParams} from 'wlc-engine/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/services/validation/validation.service';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IInputCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    validators?: ValidatorType[];
    control?: FormControl;
    name?: string;
    value?: string;
    common: {
        placeholder?: string;
        type?: string;
    }
}

export const defaultParams: IInputCParams = {
    class: 'wlc-input',
    common: {
        type: 'text',
    },
};
