import {
    Component,
    HostBinding,
    Inject,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import _each from 'lodash-es/each';
import _some from 'lodash-es/some';
import _filter from 'lodash-es/filter';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';
import _findLastIndex from 'lodash-es/findLastIndex';

import {
    ConfigService,
    EventService,
    LogService,
    IFormWrapperCParams,
    StepsEvents,
    IIndexing,
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
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';

import * as Params from './sign-up-form.params';

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
export class SignUpFormComponent extends UserActionsAbstract<Params.ISignUpFormCParams> implements OnInit {

    public config: IFormWrapperCParams;
    public $params: Params.ISignUpFormCParams;
    public formData: BehaviorSubject<IIndexing<unknown>>;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);
    @HostBinding('class.two-steps') useTwoStepsClass: boolean = this.getTwoSteps();

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignUpFormCParams,
        protected userService: UserService,
        protected validationService: ValidationService,
        protected logService: LogService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected socialService: SocialService,
        @Inject(CuracaoRequirement) private enableRequirement: boolean,
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

        if (this.configService.get<boolean>('$base.site.useLogin')) {
            this.config = Params.signUpWithLoginFormConfig;
        }

        if (this.getTwoSteps()) {
            if (this.isSecondStep()) {
                this.config = Params.twoStepsFormConfig;
                this.modifyFormByLicense(1);
            } else {
                this.config.components = _filter(this.config.components, (el) => {
                    return !['ageConfirmed', 'agreedWithTermsAndConditions'].includes(el.params.name);
                });
            }
        } else {
            this.modifyFormByLicense(0);
        }

        if (this.configService.get<boolean>('$base.profile.smsVerification.use')
            || (this.getTwoSteps() && !this.isSecondStep())) {
            const formValues = this.configService.get<IRegFormDataForConfig>('regFormData');
            _each(this.config.components, (item) => {
                if (item.name === 'core.wlc-button' && item.params?.common?.text) {
                    item.params.common.text = gettext('Next');
                }
                _each(formValues?.form?.data, (value, key) => {
                    if (item.params.name === key) {
                        item.params.value = value;
                    }
                });
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
    }

    public getTwoSteps(): boolean {
        return this.configService.get<boolean>('$modules.user.params.twoSteps')
            || !!this.configService.get<IMGAConfig>('$modules.core.components["wlc-license"].mga');
    }

    /**
     * method runs before sending and checks if the form is correct
     * @param form
     * @returns {Promise}
     */
    public beforeSubmit(form: FormGroup): Promise<boolean> {
        return this.checkRegisterPromocode(form);
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        if ((this.getTwoSteps() && !this.isSecondStep())
            || this.configService.get<boolean>('$base.profile.smsVerification.use')) {
            this.nextStepSubmit(form);
            return;
        }

        try {
            form.disable();
            if (!this.checkConfirmation(form)) {
                return;
            }
            let regData = this.formDataPreparation(form);
            if (this.getTwoSteps() && this.isSecondStep()) {
                regData = _merge(this.configService.get<IRegFormDataForConfig>('regFormData')?.form, regData);
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
        } catch (error) {
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

    protected nextStepSubmit(form: FormGroup) {
        if ((!this.getTwoSteps() || this.isSecondStep()) && !this.checkConfirmation(form)) {
            return;
        }

        const formData = _merge(
            this.configService.get<IRegFormDataForConfig>('regFormData')?.form,
            this.formDataPreparation(form),
        );

        this.configService.set<object>({
            name: 'regFormData',
            value: {form: formData},
        });
        this.eventService.emit({name: StepsEvents.Next});
    }

    protected isSecondStep(): boolean {
        return this.$params.formType === 'secondStep';
    }

    protected modifyFormByLicense(shift: number = 0): void {
        if (this.enableRequirement) {

            const components = this.config.components.slice();

            const getInsertIndex = (): number => {
                const lastCheckbox = _findLastIndex(
                    this.config.components,
                    (item) => item.name === 'core.wlc-checkbox',
                );
                return lastCheckbox === -1
                    ? this.config.components.length
                    : lastCheckbox + shift;
            };

            if (_findLastIndex(components, (item) => item.params.name === 'agreeWithSelfExcluded') === -1) {
                components.splice(
                    getInsertIndex(),
                    0,
                    {
                        name: 'core.wlc-checkbox',
                        params: {
                            name: 'agreeWithSelfExcluded',
                            text: this.configService.get<string>('$base.legal.selfExcludedCheckboxText')
                                || gettext('I have not self-excluded from any gambling website in the past 12 months'),
                            wlcElement: 'block_self_excluded',
                            common: {
                                customModifiers: 'self-exclude',
                            },
                            validators: ['requiredTrue'],
                        },
                    },
                );
            }

            if (_findLastIndex(components, (item) => item.params.name === 'agreedWithTermsAndConditions') === -1) {
                components.splice(getInsertIndex(), 0, FormElements.terms);
            }

            if (_findLastIndex(components, (item) => item.params.name === 'ageConfirmed') === -1) {
                components.splice(getInsertIndex(), 0, FormElements.age);
            }

            this.config.components = components;
        }
    }
}
