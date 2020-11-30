import {FormControl} from '@angular/forms';
import {CustomType, IComponentParams} from 'wlc-engine/classes/abstract.component';
import {ValidatorType} from 'wlc-engine/modules/core/services/validation/validation.service';

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
