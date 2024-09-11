import {
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import {IAlias} from 'wlc-engine/modules/core/components/select/select.params';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IPhoneLimits} from 'wlc-engine/modules/core/system/services/select-values/select-values.service';

export interface IControlResult {
    value: string | null;
    errors: ValidationErrors;
}

export interface IFormsConfig {
    customValidators?: IIndexing<ValidatorFn>;
    customPhoneLimits?: IPhoneLimits;
    formElements?: {
        showIcon?:  {
            use: boolean;
            components: TComponentShowIcon[];
        },
        showCountryNamesForPhoneCodes?: boolean;
        isoByPhoneCode?: IIndexing<string>;
        aliases?: {
            countries?: IAlias[],
        };
    },
}

export type TComponentShowIcon = 'phoneCode' | 'countryCode' | 'currency';
