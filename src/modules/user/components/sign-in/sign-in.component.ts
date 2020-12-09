import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {
    ModalService,
} from 'wlc-engine/modules/core/system/services';

@Component({
    selector: '[wlc-sign-in]',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-sign-in';

    public signInForm: FormGroup;

    constructor(
        protected userService: UserService,
        protected ModalService: ModalService,
    ) {
    }

    ngOnInit(): void {
        this.formInitialization();
    }

    public submitHandler(): void {
        const formData = {...this.signInForm.value};
        this.userService.login(formData.email, formData.password);

        //TODO DELETE AFTER ENGINE RELEASE 13.11.2020
        this.ModalService.closeModal('login');
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
