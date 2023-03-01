import {
    UntypedFormControl,
    ValidationErrors,
} from '@angular/forms';

// eslint-disable-next-line max-len
export const emailRegex: RegExp = /^[\w!#$%&\'*+/=?\\^`{|}~-]+(?:\.[\w!#$%&\'*+/=?\\^`{|}~-]+)*@(?:[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?\.)+[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?$/;

/**
 * Checks that form control value is email
 *
 * @param {FormControl} control Form control
 * @returns {ValidationErrors | null} True if form control value contains valid email
 */
export function emailValidator(control: UntypedFormControl): ValidationErrors | null {
    return !control.value || emailRegex.test(control.value) ? null : {
        'email': true,
    };
}
