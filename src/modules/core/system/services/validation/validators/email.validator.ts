import {
    FormControl,
    ValidationErrors,
} from '@angular/forms';
// eslint-disable-next-line max-len
const mailReg: RegExp = /^[\w!#$%&\'*+/=?\\^`{|}~-]+(?:\.[\w!#$%&\'*+/=?\\^`{|}~-]+)*@(?:[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?\.)+[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?$/;

/**
 * Checks that form control value is email
 *
 * @param {FormControl} control Form control
 * @returns {ValidationErrors | null} True if form control value contains valid email
 */
export function emailValidator(control: FormControl): ValidationErrors | null {
    return !control.value || mailReg.test(control.value) ? null : {
        'email': true,
    };
}
