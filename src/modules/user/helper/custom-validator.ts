import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {IIndexing} from 'wlc-engine/interfaces';

export class CustomValidator {
    static matchPasswords(form: FormGroup): IIndexing<boolean> {
        const {confirmPassword, newPassword} = form.controls;

        if (confirmPassword.value !== newPassword.value) {
            confirmPassword.setErrors({mismatch: true});
        } else {
            confirmPassword.setErrors({mismatch: null});
        }

        return;
    }

    static uniqEmail(control: FormControl): Promise<any> | Observable<any> {
        return new Promise(resolve => {
            setTimeout(() => {
                if (control.value === 'fortestemail@mail.ru') {
                    resolve({uniqEmail: true});
                } else {
                    resolve(null);
                }
            }, 555);
        });
    }
}
