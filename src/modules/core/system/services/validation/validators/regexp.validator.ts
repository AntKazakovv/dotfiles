import {
    FormControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

/**
 * Provides validator to check form control value by regular expression
 *
 * @param {string} regexp Regular expression to check form control value
 * @returns {ValidatorFn} Form control validator
 */
export function regexpValidator(regexp: string): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
        return new RegExp(regexp).test(control.value) ? {'regexp': true} : null;
    };
}

/**
 * Provides form control validator to check form control contains emoji symbols
 *
 * @returns {ValidatorFn} Form control validator
 */
export function regexpEmojiValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
        return (control.value)?.match(new RegExp(/\p{Emoji_Presentation}/gu)) ? {'regexpEmoji': true} : null;
    };
}
