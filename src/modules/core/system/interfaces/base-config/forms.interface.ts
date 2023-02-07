import {
    ValidatorFn,
} from '@angular/forms';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export interface IFormsConfig {
    customValidators: IIndexing<ValidatorFn>;
}
