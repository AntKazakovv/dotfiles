import {Injectable} from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
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

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
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
} from './validators';

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
            validator: Validators.pattern(/[^\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/g),
        },
    };

    private delay: number = 500;

    constructor(
        private dataService: DataService,
        private eventService: EventService,
    ) {
        this.setRule<IIndexing<boolean>>('matchingFields', matchingFieldsValidator);
        this.setRule<IIndexing<boolean>>('email', emailValidator);
        this.setRule<IIndexing<boolean>>('onlyLetters', onlyLettersValidator);
        this.setRule<IIndexing<boolean>>('regExp', regexpValidator);
        this.setRule<IIndexing<boolean>>('regexpEmoji', regexpEmojiValidator);
        this.setRule<IIndexing<boolean>>('newPassword', newPasswordValidator);
        this.setRule<IIndexing<boolean>>('required', requiredFieldValidator);
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

    private checkEmail(ctrl): Promise<IIndexing<string> | IData> {
        return this.dataService.request<IIndexing<string>>('user/emailUnique',
            {email: ctrl.value});
    }
}
