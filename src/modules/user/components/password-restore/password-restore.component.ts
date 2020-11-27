import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from 'wlc-engine/modules/user/services';

@Component({
    selector: '[wlc-password-restore]',
    templateUrl: './password-restore.component.html',
    styleUrls: ['./password-restore.component.scss'],
})
export class PasswordRestoreComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-password-restore';

    public passwordRestoreForm: FormGroup;

    constructor(
        protected userService: UserService,
    ) {
    }

    ngOnInit(): void {
        this.formInitialization();
    }

    public submitHandler(): void {
        this.userService.sendPasswordRestore({...this.passwordRestoreForm.value});
    };

    public checkField(fieldName: string): boolean {
        return this.passwordRestoreForm.get(fieldName).invalid && this.passwordRestoreForm.get(fieldName).touched;
    }

    protected formInitialization(): void {
        this.passwordRestoreForm = new FormGroup({
            email: new FormControl('',
                [
                    Validators.required,
                    Validators.email,
                ]),
        });
    }
}
