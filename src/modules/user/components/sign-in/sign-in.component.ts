import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
    selector: '[wlc-sign-in]',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-sign-in';

    public signInForm: FormGroup;

    constructor() {
    }

    ngOnInit(): void {
        this.formInitialization();
    }

    public submitHandler(): void {
        const formData = {...this.signInForm.value};

        console.log(formData);
    };

    public checkField(fieldName: string): boolean {
        return this.signInForm.get(fieldName).invalid && this.signInForm.get(fieldName).touched;
    }

    protected formInitialization(): void {
        this.signInForm = new FormGroup({
            email: new FormControl('',
                [
                    Validators.required,
                    Validators.email,
                ]),
            password: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(6),
                ]),
        });
    }
}
