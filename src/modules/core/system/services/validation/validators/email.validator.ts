import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';
// eslint-disable-next-line max-len
const mailReg: RegExp = /^[\w!#$%&\'*+/=?\\^`{|}~-]+(?:\.[\w!#$%&\'*+/=?\\^`{|}~-]+)*@(?:[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?\.)+[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?$/;

export function email(control: FormControl) {
    return !control.value || mailReg.test(control.value) ? null : {
        'email': true,
    };
}
