import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidatorFn, Validators} from '@angular/forms';
import {DataService} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {IRequestMethod} from 'wlc-engine/modules/core/system/services/data/data.service';
import {matchingFields} from './validators/matchFields.validator';
import {email} from './validators/email.validator';

export type ValidatorType = string | IValidatorSettings;

export interface IValidatorSettings {
    name: string;
    options: any | number;
}

export interface IValidatorListItem {
    validator: ValidatorFn | AsyncValidatorFn | any;
    async?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    public validatorList: IIndexing<IValidatorListItem> = {
        emailUnique: {
            validator: this.emailUnique.bind(this),
            async: true,
        },
        loginUnique: {
            validator: this.loginUnique.bind(this),
            async: true,
        },
        password: {
            validator: this.passwordRule.bind(this),
            async: true,
        },
        required: {
            validator: Validators.required,
        },
        minLength: {
            validator: Validators.minLength,
        },
        maxLength: {
            validator: Validators.max,
        },
        regExp: {
            validator: Validators.pattern,
        },
    }

    constructor(
        private dataService: DataService,
    ) {
        this.setRule<IIndexing<boolean>>('matchingFields', matchingFields);
        this.setRule<IIndexing<boolean>>('email', email);
    }

    public emailUnique(ctrl: AbstractControl): Promise<IIndexing<boolean>> {
        return this.dataService.request<IIndexing<string>>('user/emailUnique', {email: ctrl.value})
            .then(value => {
                return value.data.result ? null : {
                    'email-not-unique': true,
                };
            });
    }

    public loginUnique(ctrl: AbstractControl): Promise<IIndexing<boolean>> {
        return this.dataService.request<IIndexing<string>>('user/loginUnique', {login: ctrl.value})
            .then(value => {
                return value.data.result ? null : {
                    'login-not-unique': true,
                };
            });
    }

    public passwordRule(ctrl: AbstractControl): Promise<IIndexing<boolean>> {
        return this.dataService.request<IIndexing<string>>({
            name: 'passwordValidation',
            system: 'user',
            url: '/validate/user-register',
            type: 'POST',
        } as IRequestMethod, {data: {password: ctrl.value}, fields: ['password']}).then(value => {
            return value.data.result ? null : {
                'password': true,
            };
        });
    };

    public getValidator(validator: string): IValidatorListItem {
        return this.validatorList[validator];
    }

    private setRule<T>(name: string, rule: any, async: boolean = false): void {
        this.validatorList[name] = {
            validator: rule.bind(this),
            async,
        };
    }
}
