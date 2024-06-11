import {
    UntypedFormControl,
    ValidationErrors,
} from '@angular/forms';

import {emailRegex} from './email.validator';
import {userIdRegex} from './user-id.validator';

const emailOrUserId: RegExp = new RegExp(`(${emailRegex.source})|(${userIdRegex.source})`);

/**
 * Checks that form control value is email or userId
 *
 * @param {FormControl} control Form control
 * @returns {ValidationErrors | null} True if form control value contains valid email or userId
 */
export function emailOrUserIdValidator(control: UntypedFormControl): ValidationErrors | null {
    return !control.value || emailOrUserId.test(control.value) ? null : {
        'emailOrUserId': true,
    };
}
