import {
    FormControl,
    ValidationErrors,
} from '@angular/forms';

import {emailRegex} from './email.validator';

// eslint-disable-next-line max-len
export const PHONE_REGEX: RegExp = /^\d{5,13}$/;

const emailOrPhone: RegExp = new RegExp(`(${emailRegex.source})|(${PHONE_REGEX.source})`);

/**
 * Checks that form control value is email or phone
 *
 * @param {FormControl} control Form control
 * @returns {ValidationErrors | null} True if form control value contains valid email or phone
 */
export function emailOrPhoneValidator(control: FormControl): ValidationErrors | null {
    return !control.value || emailOrPhone.test(control.value) ? null : {
        'emailOrPhone': true,
    };
}
