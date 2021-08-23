import {
    FormControl,
    ValidationErrors,
} from '@angular/forms';

/**
 * Checks that form control value contains only latin letters
 *
 * @param {FormControl} control Form control
 * @returns {ValidationErrors | null} True if control contains only latin letters
 */
export function onlyLettersValidator(control: FormControl): ValidationErrors | null {
    return /^[A-Za-z]+$/.test(control.value) ? null : {
        'onlyLetters': true,
    };
}
