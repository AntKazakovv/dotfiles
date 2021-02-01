import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';
// eslint-disable-next-line max-len
const mailReg: RegExp = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

export function email(control: FormControl) {
    return !control.value || mailReg.test(control.value) ? null : {
        'email': true,
    };
}
