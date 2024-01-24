import {
    ValidatorFn,
} from '@angular/forms';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IPhoneLimits} from 'wlc-engine/modules/core/system/services/select-values/select-values.service';

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
    },
}

export type TComponentShowIcon = 'phoneCode' | 'countryCode';
