import {
    UntypedFormControl,
    ValidationErrors,
} from '@angular/forms';

/**
 * Checks that form control is not empty
 *
 * @param {FormControl} ctrl Form control
 * @returns {ValidationErrors | null} True if value of form control is not empty
 */
export function requiredFieldValidator(ctrl: UntypedFormControl): ValidationErrors | null {
    return ctrl.touched && !ctrl.value ? {'required': true} : null;
}
