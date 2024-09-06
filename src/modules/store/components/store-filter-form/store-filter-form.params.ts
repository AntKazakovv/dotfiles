import {UntypedFormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';

import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {IStoreFilterValue} from 'wlc-engine/modules/store/system/interfaces/store.interface';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IStoreFilterFormCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    formConfig: IFormWrapperCParams;
    onSubmit: (form: UntypedFormGroup) => Promise<boolean>;
    formData: BehaviorSubject<IStoreFilterValue>;
}

export const defaultParams: Partial<IStoreFilterFormCParams> = {
    class: 'wlc-store-filter-form',
};
