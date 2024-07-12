import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {
    BehaviorSubject,
    filter,
    takeUntil,
} from 'rxjs';
import _each from 'lodash-es/each';
import _some from 'lodash-es/some';
import _filter from 'lodash-es/filter';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';

import {
    ConfigService,
    EventService,
    LogService,
    IFormWrapperCParams,
    StepsEvents,
    IIndexing,
    DataService,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    UserActionsAbstract,
    InjectionService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {TurnstileService} from 'wlc-engine/modules/security/turnstile/system/services';
import {ValidationService} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {IMGAConfig} from 'wlc-engine/modules/core/components/license/license.params';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';
import {SignUpService} from 'wlc-engine/modules/user/submodules/signup/system/services/signup.service';
import {IRegFormDataForConfig} from 'wlc-engine/modules/user/submodules/signup/system/interfaces/signup.interface';

import * as Params from './sign-up-form.params';

/**
 * Sign-up form component.
 * Can be called via url path (/en/signup) as a modal window or via modal service ((showModal('signup')).
 * @example
 *
 * {
 *     name: 'signup.wlc-sign-up-form',
 * }
 *
 */
@Component({
    selector: '[wlc-sign-up-form]',
    templateUrl: './sign-up-form.component.html',
    styleUrls: ['./styles/sign-up-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpFormComponent extends UserActionsAbstract<Params.ISignUpFormCParams> implements OnInit, OnDestroy {

    public config: IFormWrapperCParams;
    public override $params: Params.ISignUpFormCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);
    private isTwoSteps: boolean;
    private useSmsVerification: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignUpFormCParams,
        userService: UserService,
        protected validationService: ValidationService,
        logService: LogService,
        configService: ConfigService,
        eventService: EventService,
        protected socialService: SocialService,
        protected dataService: DataService,
        injectionService: InjectionService,
        @Inject(CuracaoRequirement) private enableRequirement: boolean,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, eventService, injectionService, logService, userService);
    }

    @CustomHook('user', 'signUpFormNgOnInit')
    public override async  ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.useSmsVerification = this.configService.get<boolean>('$base.profile.smsVerification.use');
        this.isTwoSteps = this.configService.get<boolean>('$modules.user.params.twoSteps')
            || !!this.configService.get<IMGAConfig>('$modules.core.components["wlc-license"].mga')
            || this.configService.get<string>('appConfig.license') === 'romania';

        if (this.isTwoSteps) {
            this.addModifiers('two-steps');
        }

        this.config = _cloneDeep(this.$params.formConfig);
        if (!this.config) {
            this.config = this.configService.get<boolean>('$base.site.useLogin')
                ? _cloneDeep(Params.signUpWithLoginFormConfig)
                : _cloneDeep(Params.signUpFormConfig);
        }

        if (this.isTwoSteps) {
            if (this.isSecondStep()) {
                if (this.configService.get<string>('appConfig.license') === 'romania') {
                    this.config = _cloneDeep(Params.twoStepsFormConfigRomania);
                } else {
                    this.config = _cloneDeep(Params.twoStepsFormConfig);
                }

                const data = {
                    shift: 1,
                    config: this.config,
                    selfExcludedText: this.configService.get<string>('$base.legal.selfExcludedCheckboxText'),
                    enableRequirement: this.enableRequirement,
                };
                SignUpService.modifyFormByLicense(data);
            } else {
                this.config.components = _filter(this.config.components, (el) => {
                    return !['ageConfirmed', 'agreedWithTermsAndConditions'].includes(el.params.name);
                });
            }
        } else {
            const data = {
                shift: 0,
                config: this.config,
                selfExcludedText: this.configService.get<string>('$base.legal.selfExcludedCheckboxText'),
                enableRequirement: this.enableRequirement,
            };
            SignUpService.modifyFormByLicense(data);
        }


        if (this.useSmsVerification || this.isTwoSteps) {
            _each(this.config.components, (item) => {
                if (item.name === 'core.wlc-button' && item.params?.common?.text && !this.isSecondStep()) {
                    item.params.common.text = gettext('Next');
                }
            });
        }

        if (this.configService.get<boolean>('$base.profile.socials.use')
            || this.configService.get<boolean>('appConfig.siteconfig.useMetamask')) {
            this.addModifiers('socials');

            if (!_some(this.config.components, (el: IFormComponent) => el.name === 'user.wlc-social-networks')) {
                this.config.components.unshift({
                    name: 'user.wlc-social-networks',
                    params: {},
                });
            }
        }

        this.$params.formData = this.setPromocode(this.$params.formData);

        if (this.$params.formData) {
            this.formData = new BehaviorSubject(this.$params.formData);
        }

        const useTurnstile = this.configService.get('appConfig.objectData.turnstile.isEnabled');
        if (useTurnstile){
            const turnstileService = await this.injectionService.getService<TurnstileService>(
                'turnstile.turnstile-service',
            );
            turnstileService.launch('signup');
        }
    }

    @CustomHook('user', 'signUpFormNgOnDestroy')
    public override ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public override getForm(form: UntypedFormGroup): void {
        super.getForm(form);

        form.get('countryCode')?.valueChanges
            .pipe(
                filter((val: string): boolean => !val),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                const country: string = this.configService.get<string>('appConfig.country');
                form.get('countryCode').setValue(country);

                if (this.configService.get<boolean>('$base.registration.filterCurrencyByCountry')) {
                    this.eventService.emit({
                        name: 'SELECT_CHOSEN_COUNTRYCODE',
                        data: {
                            value: country,
                        },
                    });
                }
            });
    }

    /**
     * implementation of submit; in addition to validation and sending data, this method can switch next step
     * @param form
     * @returns {Promise}
     */
    @CustomHook('user', 'signUpFormNgSubmit')
    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {

        if (this.isTwoSteps && !this.isSecondStep() || this.useSmsVerification) {
            await this.nextStepSubmit(form);
            return;
        }

        try {
            form.disable();
            if (!await this.checkConfirmation(form)) {
                return false;
            }
            let regData = this.formDataPreparation(form, this.$params.skipEmailVerification);
            if (this.isTwoSteps && this.isSecondStep()) {
                regData = _merge(this.configService.get<IRegFormDataForConfig>('regFormData')?.form, regData);
            }


            if (this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.setNonceToLocalStorage();
            }

            await this.userService.validateRegistration(regData);
            await this.finishUserReg(regData.data, this.$params.skipEmailVerification);

            return true;
        } catch (error) {

            if (this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.deleteNonceFromLocalStorage();
            }

            this.showRegError(error);
            if (_isObject(error.errors)) {
                this.errors$.next(error.errors);
            }

            return false;
        } finally {
            form.enable();
        }
    }

    protected async checkRegisterPromocode(form: UntypedFormGroup): Promise<boolean> {
        const promocodeControl = form.get('registrationPromoCode');
        const currencyControl = form.get('currency');

        if (!promocodeControl?.value || !currencyControl) {
            return true;
        }

        promocodeControl.markAsPending();

        try {
            const result: boolean = await this.validationService.checkPromocode(
                promocodeControl.value,
                currencyControl.value,
                form.get('countryCode')?.value || '',
            );

            if (result) {
                return true;
            } else {
                throw new Error('Unknown promo code');
            }
        } catch (error) {
            promocodeControl.setErrors({promocode: true});

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Promo code error'),
                    message: error.errors || error.message || error,
                    wlcElement: 'notification_promocode-error',
                },
            });

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

    protected async nextStepSubmit(form: UntypedFormGroup): Promise<void> {

        if (this.useSmsVerification && !await this.checkRegisterPromocode(form)) {
            return;
        }

        if ((!this.isTwoSteps || this.isSecondStep()) && !await this.checkConfirmation(form)) {
            return;
        }
        this.eventService.emit({name: StepsEvents.Next});
    }

    protected isSecondStep(): boolean {
        return this.$params.formType === 'secondStep';
    }
}
