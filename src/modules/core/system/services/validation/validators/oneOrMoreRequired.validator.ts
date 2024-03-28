import {
    UntypedFormGroup,
    ValidationErrors,
    UntypedFormControl,
} from '@angular/forms';

import _each from 'lodash-es/each';

export function oneOrMoreRequiredValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
    let value: number = 0;

    _each(formGroup.controls, (control: UntypedFormControl) => {
        if (control.value) {
            value ++;
        }
    });

    return value > 0 ? null : {'required': true};
}
