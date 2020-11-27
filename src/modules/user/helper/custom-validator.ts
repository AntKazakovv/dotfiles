import {FormControl, FormGroup} from '@angular/forms';
import {IIndexing} from 'wlc-engine/interfaces';
import {UserService} from 'wlc-engine/modules/user/services';
import {Observable, from, timer, of} from 'rxjs';
import {debounceTime, delay, switchMap, tap, map, catchError} from 'rxjs/operators';

export class CustomValidator {
    protected static emailTimeout;

    public static matchPasswords(form: FormGroup): IIndexing<boolean> {
        const {confirmPassword, newPassword} = form.controls;

        if (confirmPassword.value !== newPassword.value) {
            confirmPassword.setErrors({mismatch: true});
        } else {
            confirmPassword.setErrors(null);
        }

        return;
    }

    public static uniqEmail(control: FormControl): Observable<any> {
        return of(control.value).pipe(
            delay(500),
            switchMap((email) => from(UserService.instance.emailUnique(control.value)).pipe(
                map(emailExists => {
                    return emailExists.result ? null : {uniqEmail: true};
                }))));
    }

    // Реализван через промис
    // public static uniqEmail(control: FormControl): Promise<any> {
    //     clearTimeout(CustomValidator.emailTimeout);
    //
    //     return new Promise(resolve => {
    //         CustomValidator.emailTimeout = setTimeout(async () => {
    //             const emailExists = await UserService.instance.emailUnique(control.value);
    //             if (!emailExists.result) {
    //                 resolve({uniqEmail: true});
    //             } else {
    //                 resolve(null);
    //             }
    //         }, 600);
    //     });
    // }
}
