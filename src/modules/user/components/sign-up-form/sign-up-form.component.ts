import {
    Component,
    HostBinding,
    Inject,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

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
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {IMGAConfig} from 'wlc-engine/modules/core/components/license/license.params';

import * as Params from './sign-up-form.params';

import _each from 'lodash-es/each';
import _some from 'lodash-es/some';
import _filter from 'lodash-es/filter';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

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
    public isMGALicense: boolean = !!this.configService.get<IMGAConfig>('$modules.core.components["wlc-license"].mga');
    @HostBinding('class.mga-license') useMGAClass: boolean = this.isMGALicense;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignUpFormCParams,
        protected userService: UserService,
        protected logService: LogService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected socialService: SocialService,
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
        if (this.isMGALicense) {
            if (this.isMGAFormStep()) {
                this.config = Params.magLicenseFormConfig;
            } else {
                this.config.components = _filter(this.config.components, (el) => {
                    return !['ageConfirmed', 'agreedWithTermsAndConditions'].includes(el.params.name);
                });
            }
        }

        if (this.configService.get<boolean>('$base.profile.smsVerification.use')
            || (this.isMGALicense && !this.isMGAFormStep())) {
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

    public async ngSubmit(form: FormGroup): Promise<void> {
        if ((this.isMGALicense && !this.isMGAFormStep())
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
            if (this.isMGALicense && this.isMGAFormStep()) {
                regData = _merge(this.configService.get<IRegFormDataForConfig>('regFormData')?.form, regData);
            }
            await this.userService.validateRegistration(regData);
            await this.finishUserReg(regData.data);
        } catch (error) {
            this.showRegError(error);
        } finally {
            form.enable();
        }
    }

    protected nextStepSubmit(form: FormGroup) {
        if ((!this.isMGALicense || this.isMGAFormStep()) && !this.checkConfirmation(form)) {
            return;
        }

        const formData = _merge(
            this.formDataPreparation(form), this.configService.get<IRegFormDataForConfig>('regFormData')?.form,
        );

        this.configService.set<object>({
            name: 'regFormData',
            value: {form: formData},
        });
        this.eventService.emit({name: StepsEvents.Next});
    }

    protected isMGAFormStep(): boolean {
        return this.$params.formType === 'mga';
    }
}
