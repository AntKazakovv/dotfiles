import {UntypedFormGroup} from '@angular/forms';

import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransferCodeFormCParams extends IComponentParams<Theme, Type, ThemeMod> {
    formConfig: IFormWrapperCParams;
    onSubmit: (form: UntypedFormGroup) => Promise<boolean>;
}

export const defaultParams: Partial<ITransferCodeFormCParams> = {
    moduleName: 'transfer',
    componentName: 'wlc-transfer-code-form',
    class: 'wlc-transfer-code-form',
};
