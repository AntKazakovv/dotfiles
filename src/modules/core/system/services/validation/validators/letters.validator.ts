import {
    UntypedFormControl,
    ValidationErrors,
} from '@angular/forms';

/**
 * Checks that form control value contains only latin letters
 *
 * @param {FormControl} control Form control
 * @returns {ValidationErrors | null} True if control contains only latin letters
 */
export function onlyLettersValidator(control: UntypedFormControl): ValidationErrors | null {
    return !control.value || /^[A-zА-я]+$/.test(control.value) ? null : {
        'onlyLetters': true,
    };
}
