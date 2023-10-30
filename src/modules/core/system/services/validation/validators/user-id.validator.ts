import {
    UntypedFormControl,
    ValidationErrors,
} from '@angular/forms';

// eslint-disable-next-line max-len
export const userIdRegex: RegExp = /^\d{1,10}$/; //max value for userID - 4294967295(unsigned int(11) in db)

/**
 * Checks that form control value is userID
 *
 * @param {FormControl} control Form control
 * @returns {ValidationErrors | null} True if form control value contains valid userID
 */
export function userIdValidator(control: UntypedFormControl): ValidationErrors | null {
    return !control.value || userIdRegex.test(control.value) ? null : {
        'userId': true,
    };
}
