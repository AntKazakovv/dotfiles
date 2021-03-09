import {FormControl} from '@angular/forms';

export function newPassword(control: FormControl) {
    return (/[a-z]+/.test(control.value) &&
        /[A-Z]+/.test(control.value) &&
        /[0-9]+/.test(control.value) &&
        /["!@#\$%\^&\*\(\)\.,_\-\+"`~=\\\|;:'/\?]+/.test(control.value)) ? null : {newPasswordReg: null};
}
