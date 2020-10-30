import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from 'wlc-engine/modules/user/helper/custom-validator';

@Component({
    selector: '[wlc-password-change]',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-password-change';

    public passwordChangeForm: FormGroup;

    constructor() {
    }

    ngOnInit(): void {
        this.formInitialization();
    }

    public submitHandler(): void {
        const formData = {...this.passwordChangeForm.value};

        console.log(formData);
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
                    Validators.required,
                    Validators.minLength(6),
                ]),
        }, {validators: CustomValidator.matchPasswords});
    }

}
