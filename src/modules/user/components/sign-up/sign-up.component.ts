import {Component, HostBinding, OnInit, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from 'wlc-engine/modules/user/helper/custom-validator';
import {UserService} from 'wlc-engine/modules/user/services/user.service';
import {ConfigService} from 'wlc-engine/modules/core/services';

import {
    keys as _keys,
    map as _map,
} from 'lodash';

interface ICurrency {
    Name: string,
    Alias: string,
    ID?: string | number,
    ExRate?: string,
    registration?: boolean,
}

@Component({
    selector: '[wlc-sign-up]',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-sign-up';

    public signUpForm: FormGroup;
    protected validationFields: string[] = ['email', 'password', 'passwordRepeat', 'phoneCode', 'phoneNumber', 'gender',
        'firstName', 'lastName', 'countryCode', 'currency', 'login', 'ageConfirmed',
        'agreedWithTermsAndConditions', 'registrationPromoCode'];

    constructor(
        protected userService: UserService,
        protected configService: ConfigService,
    ) {}

    public ngOnInit(): void {
        this.formInitialization();
    }

    public get currencies(): ICurrency[] {
        const currencies = this.configService.get<ICurrency[]>('appConfig.siteconfig.currencies') || [];
        return _map(currencies, item => item);
    }

    public async submitHandler(): Promise<void> {
        this.userService.registration(this.formDataPreparation());
    };

    public checkField(fieldName: string): boolean {
        return this.signUpForm.get(fieldName).invalid && this.signUpForm.get(fieldName).touched;
    }

    // Временно решение
    public checkControlField(fieldName: string): boolean {
        return this.signUpForm.get(fieldName).invalid && this.signUpForm.get(fieldName).dirty;
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
            currency: new FormControl(this.currencies[0].Name),
            agreedWithTermsAndConditions: new FormControl(false,
                [Validators.requiredTrue]),
            ageConfirmed: new FormControl(false,
                [Validators.requiredTrue]),
        });
    }

    protected formDataPreparation(): object {
        const formData = {
            'TYPE': 'user-register',
            data: {...this.signUpForm.value},

            //Передавть нужные поля
            fields: _keys(this.signUpForm.value),
        };

        return formData;
    }
}
