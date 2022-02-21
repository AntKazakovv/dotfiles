import {Injectable} from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    Observable,
    from,
    of,
} from 'rxjs';
import {
    delay,
    map,
    switchMap,
} from 'rxjs/operators';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    IData,
    IRequestMethod,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {
    matchingFieldsValidator,
    emailValidator,
    regexpEmojiValidator,
    regexpValidator,
    onlyLettersValidator,
    newPasswordValidator,
    requiredFieldValidator,
    loginEmailFieldValidator,
    loginFieldValidator,
} from './validators';
import {IValidationPasswordRules} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';

export type ValidatorType = string | IValidatorSettings;

export interface IValidatorSettings {
    name: string;
    options: any | number;
    text?: string;
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
        emailExist: {
            validator: this.emailExist.bind(this),
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
        passwordLength: {
            validator: this.passwordLength.bind(this),
        },
        requiredTrue: {
            validator: Validators.requiredTrue,
        },
        minLength: {
            validator: Validators.minLength,
        },
        maxLength: {
            validator: Validators.maxLength,
        },
        max: {
            validator: Validators.max,
        },
        min: {
            validator: Validators.min,
        },
        numberDecimal: {
            validator: Validators.pattern(/^\d+(\.\d{1,2})*$/),
        },
        pattern: {
            validator: Validators.pattern,
        },
        allowLettersOnly: {
            validator: Validators.pattern(/^(?!.*--)/.source
                + /[^\d!"#$%&'()*+,.\/:;<=>?@[\\\]^_`{|}~¡¿÷ˆ№-]+/.source
                + /[^\d!"#$%&'()*+,.\/:;<=>?@[\\\]^_`{|}~¡¿÷ˆ№]*$/.source),
        },
    };

    private delay: number = 500;

    constructor(
        private dataService: DataService,
        private configService: ConfigService,
    ) {
        this.setRule('matchingFields', matchingFieldsValidator);
        this.setRule('email', emailValidator);
        this.setRule('onlyLetters', onlyLettersValidator);
        this.setRule('regExp', regexpValidator);
        this.setRule('regexpEmoji', regexpEmojiValidator);
        this.setRule('newPassword', newPasswordValidator);
        this.setRule('required', requiredFieldValidator);
        this.setRule('loginEmail', loginEmailFieldValidator);
        this.setRule('login', loginFieldValidator);
    }

    public emailUnique(ctrl: AbstractControl): Observable<IIndexing<boolean>> {
        return of(ctrl.value).pipe(
            delay(this.delay),
            switchMap(() => from(this.checkEmail(ctrl)).pipe(
                map(response => {
                    return response.data.result ? null : {'email-not-unique': true};
                }),
            )));
    }

    public emailExist(ctrl: AbstractControl): Observable<IIndexing<boolean>> {
        return of(ctrl.value).pipe(
            delay(this.delay),
            switchMap(() => from(this.checkEmail(ctrl)).pipe(
                map(response => {
                    return !response.data.result ? null : {'email-not-exist': true};
                }),
            )));
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
        if (!ctrl.value) {
            return of(null).toPromise();
        }

        return this.dataService.request<IIndexing<string>>({
            name: 'passwordValidation',
            system: 'user',
            url: '/validate/user-register',
            type: 'POST',
        } as IRequestMethod, {data: {password: ctrl.value}, fields: ['password']}).then(value => {
            return value.data.result ? null :
                this.configService.get<IValidationPasswordRules>('$base.profile.passwordValidation.rules') ?
                    {'configPassword': true} : {'password': true};
        });
    };

    public getValidator(validator: string): IValidatorListItem {
        return this.validatorList[validator];
    }

    /**
     * do request on server to check promocode is correct
     * @param promocode string
     * @param currency string
     * @param country string
     * @returns Promise<boolean>
     */
    public async checkPromocode(promocode: string, currency: string, country: string = ''): Promise<boolean> {
        try {
            const response = await this.dataService.request<IData>(
                {
                    name: 'promocode',
                    system: 'user',
                    url: '/profiles/promocode',
                    type: 'PUT',
                },
                {promocode, currency, country},
            );

            return response.data.result;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Validate length password
     * @param {AbstractControl} ctrl Form control
     * @returns {{ValidationErrors | null} True if length right, else false
     */
    private passwordLength(ctrl: AbstractControl): ValidationErrors | null {
        let minLength = 6;
        let maxLength = 50;

        if (this.configService.get<boolean>('$base.profile.passwordValidation.use')) {
            const rules = this.configService.get<IValidationPasswordRules>('$base.profile.passwordValidation.rules');

            minLength = rules.minLength ?? minLength;

            if (rules.maxLength) {
                maxLength = rules.maxLength;
            }
        }

        if (ctrl.value.length < minLength && ctrl.value) {
            return {'minlength': true};
        }

        if (ctrl.value.length > maxLength) {
            return {'passwordMaxlength': true};
        }

        if (ctrl.value.length >= minLength && ctrl.value.length <= maxLength) {
            return null;
        }
    }

    private setRule(name: string, rule: any, async: boolean = false): void {
        this.validatorList[name] = {
            validator: rule.bind(this),
            async,
        };
    }

    private checkEmail(ctrl): Promise<IData | Partial<IData>> {
        if (this.configService.get<boolean>('appConfig.hideEmailExistence')) {
            return new Promise(resolve => {
                resolve({
                    data: {
                        result: true,
                    },
                });
            });
        }
        return this.dataService.request<IIndexing<string>>('user/emailUnique',
            {email: ctrl.value});
    }
}
