import {
    UntypedFormControl,
    ValidationErrors,
} from '@angular/forms';

/**
 * Cheсks that password contains digits, letters in lowercase and uppercase, special symbols
 *
 * @param {FormControl} control Form control
 * @returns {{ValidationErrors | null} True if contains, else false
 */
export function newPasswordValidator(control: UntypedFormControl): ValidationErrors | null {
    return (/[a-z]+/.test(control.value) &&
        /[A-Z]+/.test(control.value) &&
        /\d+/.test(control.value) &&
        /[!"#\$%&'\(\)\*\+,\.\/:;=\?@\\\^_`\|~\-]+/.test(control.value)) ? null : {newPasswordReg: null};
}
