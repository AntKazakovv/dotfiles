import {
    FormControl,
} from '@angular/forms';

export function onlyLetters(control: FormControl) {
    return /^[A-Za-z]+$/.test(control.value) ? null : {
        'onlyLetters': true,
    };
}
