import {
    FormControl,
} from '@angular/forms';

export function onlyLetters(control: FormControl) {
    return /^[a-zA-Z]+$/.test(control.value) ? null : {
        'onlyLetters': true,
    };
}
