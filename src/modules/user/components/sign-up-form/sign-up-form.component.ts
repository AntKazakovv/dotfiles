import {
    Component,
    HostBinding,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    AbstractControl,
    FormGroup,
} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {
    filter,
    take,
} from 'rxjs/operators';

import {
    ConfigService,
    EventService,
    LogService,
    IFormWrapperCParams,
    StepsEvents,
    IIndexing,
    IData,
    CachingService,
    ISaveSignUpForm,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    UserActionsAbstract,
    IValidateData,
} from '../../system/classes/user-actions-abstract.class';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {ValidationService} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {IMGAConfig} from 'wlc-engine/modules/core/components/license/license.params';

import * as Params from './sign-up-form.params';

import _each from 'lodash-es/each';
import _some from 'lodash-es/some';
import _filter from 'lodash-es/filter';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';
import _every from 'lodash-es/every';

export interface IRegFormDataForConfig {
    form: IValidateData;
}

/**
 * Sign-up form component.
 * Can be called via url path (/en/signup) as a modal window or via modal service ((showModal('signup')).
 * @example
 *
 * {
 *     name: 'user.wlc-sign-up-form',
 * }
 *
 */

@Component({
    selector: '[wlc-sign-up-form]',
    templateUrl: './sign-up-form.component.html',
    styleUrls: ['./styles/sign-up-form.component.scss'],
})
export class SignUpFormComponent extends UserActionsAbstract<Params.ISignUpFormCParams> implements OnInit, OnDestroy {
    @HostBinding('class.two-steps') protected useTwoStepsClass: boolean = this.isTwoSteps;

    public config: IFormWrapperCParams;
    public $params: Params.ISignUpFormCParams;
    public formData: BehaviorSubject<IIndexing<unknown>>;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);
    public form$: BehaviorSubject<FormGroup> = new BehaviorSubject(null);

    protected rememberSettings: ISaveSignUpForm;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignUpFormCParams,
        protected userService: UserService,
        protected validationService: ValidationService,
        protected logService: LogService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected socialService: SocialService,
        protected cachingService: CachingService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, userService, eventService, logService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.config = this.$params.formConfig || Params.signUpFormConfig;
        this.config = _cloneDeep(this.config);
        this.rememberSettings = this.configService.get<ISaveSignUpForm>('$base.rememberSignUpData');

        if (this.configService.get<boolean>('$base.site.useLogin')) {
            this.config = Params.signUpWithLoginFormConfig;
        }

        if (this.isTwoSteps) {
            if (this.isSecondStep) {
                this.config = Params.twoStepsFormConfig;
            } else {
                this.config.components = _filter(this.config.components, (el) => {
                    return !['ageConfirmed', 'agreedWithTermsAndConditions'].includes(el.params.name);
                });
            }
        }

        if (this.configService.get<boolean>('$base.profile.smsVerification.use')
            || (this.isTwoSteps && !this.isSecondStep)
        ) {
            _each(this.config.components, (item) => {
                if (item.name === 'core.wlc-button' && item.params?.common?.text) {
                    item.params.common.text = gettext('Next');
                    return false;
                }
            });
        }

        if (this.configService.get<boolean>('$base.profile.socials.use')) {
            this.addModifiers('socials');

            if (!_some(this.config.components, (el: IFormComponent) => el.name === 'user.wlc-social-networks')) {
                this.config.components.unshift({
                    name: 'user.wlc-social-networks',
                    params: {},
                });
            }
        }

        if (this.$params.formData) {
            this.formData = new BehaviorSubject(this.$params.formData);
        }

        if (this.useRememberFormData) {
            this.initFormValuesFromCache();
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.useRememberFormData) {
            this.form$
                .pipe(filter<FormGroup>(Boolean))
                .subscribe((form): Promise<void> => this.setRememberedFormData(form));
        }

        this.form$.complete();
    }

    /**
     * method runs before sending and checks if the form is correct
     * @param form
     * @returns {Promise}
     */
    public async beforeSubmit(form: FormGroup): Promise<boolean> {
        const results: boolean[] = await Promise.all([
            this.checkRegisterPromocode(form),
            this.checkFieldExistence(
                form,
                'email',
                'email-not-unique',
                (control: AbstractControl): Promise<IData | Partial<IData>> => {
                    return this.validationService.checkEmail(control);
                },
            ),
            this.checkFieldExistence(
                form,
                'login',
                'login-not-unique',
                (control: AbstractControl): Promise<IData> => this.validationService.checkLogin(control),
            ),
        ]);

        return _every(results);
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        if ((this.isTwoSteps && !this.isSecondStep)
            || this.configService.get<boolean>('$base.profile.smsVerification.use')
        ) {
            this.nextStepSubmit(form);
            return;
        }

        try {
            form.disable();

            if (!this.checkConfirmation(form)) {
                return;
            }
            let regData: IValidateData = this.formDataPreparation(form);

            if (this.isTwoSteps && this.isSecondStep) {
                const savedData: IRegFormDataForConfig = await this.getRememberedFormData();
                regData = _merge(savedData?.form, regData);
            }
            await this.userService.validateRegistration(regData);
            await this.finishUserReg(regData.data);
        } catch (error) {
            this.showRegError(error);

            if (_isObject(error.errors)) {
                this.errors$.next(error.errors);
            }
        } finally {
            form.enable();
        }
    }

    protected get useRememberFormData(): boolean {
        return this.configService.get<boolean>('$base.profile.smsVerification.use')
            || this.isTwoSteps
            || this.rememberSettings.use;
    }

    protected get isSecondStep(): boolean {
        return this.$params.formType === 'secondStep';
    }

    protected get isTwoSteps(): boolean {
        return this.configService.get<boolean>('$modules.user.params.twoSteps')
            || !!this.configService.get<IMGAConfig>('$modules.core.components["wlc-license"].mga');
    }

    protected async getRememberedFormData(): Promise<IRegFormDataForConfig> {
        let formValues: IRegFormDataForConfig;

        if (this.rememberSettings.useIndexedDB) {
            formValues = await this.cachingService.get<IRegFormDataForConfig>('sign-up-form-data');
        } else {
            formValues = this.configService.get<IRegFormDataForConfig>('regFormData');
        }

        return formValues;
    }

    protected async setRememberedFormData(form: FormGroup): Promise<void> {
        const saved: IRegFormDataForConfig = await this.getRememberedFormData();

        const formData = _merge(
            saved?.form,
            this.formDataPreparation(form),
        );

        if (this.rememberSettings.useIndexedDB) {
            this.cachingService.set<IRegFormDataForConfig>(
                'sign-up-form-data',
                {form: formData},
                true,
                this.rememberSettings.saveTime,
            );
        } else {
            this.configService.set<IRegFormDataForConfig>({
                name: 'regFormData',
                value: {form: formData},
            });
        }
    }

    protected async initFormValuesFromCache(): Promise<void> {
        const formValues: IRegFormDataForConfig = await this.getRememberedFormData();

        this.form$
            .pipe(
                filter(form => !!(form && formValues)),
                take(1),
            )
            .subscribe(form => form.patchValue(formValues.form.data));
    }

    protected async checkRegisterPromocode(form: FormGroup): Promise<boolean> {
        const promocodeControl = form.get('registrationPromoCode');
        const currencyControl = form.get('currency');

        if (!promocodeControl?.value || !currencyControl) {
            return true;
        }

        promocodeControl.markAsPending();

        try {
            const result = await this.validationService.checkPromocode(
                promocodeControl.value,
                currencyControl.value,
                form.get('countryCode')?.value || '',
            );

            if (result) {
                return true;
            } else {
                promocodeControl.setErrors({promocode: true});
                return false;
            }
        } catch(error) {
            promocodeControl.setErrors({promocode: true});

            this.logService.sendLog({
                code: '2.1.2',
                data: error,
                from: {
                    component: 'SignUpFormComponent',
                    method: 'checkRegisterPromocode',
                },
            });

            return false;
        }
    }

    protected async checkFieldExistence(
        form: FormGroup,
        name: string,
        errorName: string,
        callbackRequest: (control: AbstractControl) => Promise<IData | Partial<IData>>,
    ): Promise<boolean> {
        const control: AbstractControl = form.get(name);

        if (control && control.value) {
            control.markAsPending();
            control.markAsTouched();

            try {
                const response: IData | Partial<IData> = await callbackRequest(control);

                if (response.data.result) {
                    control.setErrors(null);
                    return true;
                }

                control.setErrors({[errorName]: true});
            } catch (error) {
                control.setErrors({[errorName]: true});
            }

            return false;
        }

        return true;
    }

    protected nextStepSubmit(form: FormGroup): void {
        if ((!this.isTwoSteps || this.isSecondStep) && !this.checkConfirmation(form)) {
            return;
        }

        this.eventService.emit({name: StepsEvents.Next});
    }
}
