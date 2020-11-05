import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: '[wlc-password-restore]',
    templateUrl: './password-restore.component.html',
    styleUrls: ['./password-restore.component.scss'],
})
export class PasswordRestoreComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-password-restore';

    public passwordRestoreForm: FormGroup;

    constructor() {
    }

    ngOnInit(): void {
        this.formInitialization();
    }

    public submitHandler(): void {
        const formData = {...this.passwordRestoreForm.value};

        console.log(formData);
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
