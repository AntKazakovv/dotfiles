import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from 'wlc-engine/modules/user/system/helper/custom-validator';
import {UserService} from 'wlc-engine/modules/user/system/services';

@Component({
    selector: '[wlc-password-change]',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-password-change';

    public passwordChangeForm: FormGroup;

    constructor(
        protected userService: UserService,
    ) {
    }

    ngOnInit(): void {
        this.formInitialization();
    }

    public submitHandler(): void {
        const {password, newPassword} = this.passwordChangeForm.value;
        this.userService.setNewPassword(password, newPassword);
    };

    public checkField(fieldName: string): boolean {
        return this.passwordChangeForm.get(fieldName).invalid && this.passwordChangeForm.get(fieldName).touched;
    }

    protected formInitialization(): void {
        this.passwordChangeForm = new FormGroup({
            password: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(6),
                ]),
            newPassword: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(6),
                ]),
            confirmPassword: new FormControl('',
                [
                    Validators.minLength(6),
                    Validators.required,
                ]),
        }, {validators: CustomValidator.matchPasswords});
    }

}
