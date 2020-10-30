import {Component, HostBinding, OnInit, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from 'wlc-engine/modules/user/helper/custom-validator';
import {DataService} from 'wlc-engine/modules/core/services';

interface ICurrency {
    name: string,
    alias: string,
}

@Component({
    selector: '[wlc-sign-up]',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-sign-up';

    public signUpForm: FormGroup;
    public currencies: ICurrency[] = [
        {
            name: 'EUR',
            alias: 'EUR',
        },
        {
            name: 'USA',
            alias: 'USA',
        },
        {
            name: 'RUB',
            alias: 'RUB',
        },
    ];

    constructor(
        protected dataService: DataService,
    ) {
    }

    public ngOnInit(): void {
        this.formInitialization();
        console.log(this.dataService);
    }

    public submitHandler(): void {
        const formData = {...this.signUpForm.value};

        console.log(formData);
    };

    public checkField(fieldName: string): boolean {
        return this.signUpForm.get(fieldName).invalid && this.signUpForm.get(fieldName).touched;
    }

    protected formInitialization(): void {
        this.signUpForm = new FormGroup({
            email: new FormControl('',
                [
                    Validators.required,
                    Validators.email,
                ], [CustomValidator.uniqEmail]),
            password: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(6),
                ]),
            promo: new FormControl('',
                [
                    Validators.minLength(8),
                ]),
            currency: new FormControl(this.currencies[0].name),
            agreeWithTerms: new FormControl(),
            ageConfirmed: new FormControl(),
        });
    }
}
