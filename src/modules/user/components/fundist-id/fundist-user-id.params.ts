import {UntypedFormControl} from '@angular/forms';

import {IInputCParams} from 'wlc-engine/modules/core';
import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export interface IFundistUserIdCParams extends IComponentParams<string, string, string> {
    /**
     * Start adornment inside the input field prefixing the fundist use ID value
     */
    label?: string,
}

export const defaultParams: IFundistUserIdCParams = {
    class: 'wlc-fundist-user-id',
    label: gettext('ID:'),
};

export const inputParams: IInputCParams = {
    name: 'core.wlc-input',
    locked: true,
    control: new UntypedFormControl(''),
    common: {
        readonly: true,
        useLabel: false,
    },
};
