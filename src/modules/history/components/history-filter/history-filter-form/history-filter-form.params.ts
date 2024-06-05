import {BehaviorSubject} from 'rxjs';
import {UntypedFormGroup} from '@angular/forms';
import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    IIndexing,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export type HistoryFilterFormConfigType = 'transaction' | 'bonus' | 'bet';

export interface IHistoryFilterFormCParams extends IComponentParams<Theme, Type, ThemeMod> {
    formConfig: IFormWrapperCParams;
    onSubmit: (form: UntypedFormGroup) => Promise<boolean>;
    formData: BehaviorSubject<IIndexing<any>>;
}

export const defaultParams: Partial<IHistoryFilterFormCParams> = {
    class: 'wlc-history-filter-form',
};
