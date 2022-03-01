import {
    FormControl,
    ValidationErrors,
} from '@angular/forms';
import _includes from 'lodash-es/includes';

import {emailValidator} from './email.validator';

/**
 * Check field if include @ check email else check username
 *
 * @param  ctrl {FormControl} control Form control
 * @returns {ValidationErrors | null} True if contains, else false
 */
export function loginEmailFieldValidator(ctrl: FormControl): ValidationErrors | null {
    if (_includes(ctrl.value ,'@')) {
        return emailValidator(ctrl);
    } else {
        return loginFieldValidator(ctrl);
    }
}

/**
 * Check username contains A-z0-9 and '_', '-', '.'
 *
 * @param  ctrl {FormControl} control Form control
 * @returns {ValidationErrors | null} True if contains, else false
 */
export function loginFieldValidator(ctrl: FormControl): ValidationErrors | null {
    if (!ctrl.touched) {
        return null;
    }
    return new RegExp('^[A-z0-9_.-]+$').test(ctrl.value) ? null : {'login': true};
}
