import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    LogService,
    IFormWrapperCParams,
    IPushMessageParams,
    NotificationEvents,
    StepsEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {UserActionsAbstract} from '../../system/classes/user-actions-abstract.class';
import {
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';

import * as Params from './sign-up-form.params';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';

export interface IRegFormDataForConfig {
    form: Params.IValidateData;
}

/**
 * Sign-up form component.
 *
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

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignUpFormCParams,
        protected userService: UserService,
        protected logService: LogService,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, userService, eventService, logService);
    }

    public ngOnInit(): void {
        super.ngOnInit({});
        this.config = this.$params.formConfig || Params.signUpFormConfig;
        if (this.configService.get<boolean>('$base.profile.smsVerification.use')) {
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
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        if (this.configService.get<boolean>('$base.profile.smsVerification.use')) {
            this.nextStepSubmit(form);
            return;
        }
        try {
            form.disable();
            if (!this.checkConfirmation(form)) {
                return;
            }
            const regData = this.formDataPreparation(form);
            await this.userService.registration(regData);
            await this.finishUserReg(regData.data);
        } catch (error) {
            this.showRegError(error);
        } finally {
            form.enable();
        }
    }

    protected nextStepSubmit(form: FormGroup) {
        if (!this.checkConfirmation(form)) {
            return;
        }
        const formData = this.formDataPreparation(form);

        this.configService.set<object>({
            name: 'regFormData',
            value: {form: formData},
        });
        this.eventService.emit({name: StepsEvents.Next});
    }

    protected formDataPreparation(form: FormGroup): Params.IValidateData {
        const formData = {
            'TYPE': 'user-register',
            data: {...form.value},
            fields: _keys(form.value),
        };

        const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);

        if (chosenBonus?.id) {
            formData.data.registrationBonus = chosenBonus.id;
            formData.fields.push('registrationBonus');
        }
        return formData;
    }

    protected checkConfirmation(form: FormGroup): boolean {
        const {ageConfirmed, agreedWithTermsAndConditions} = form.value;

        if (ageConfirmed && agreedWithTermsAndConditions) {
            return true;
        }

        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Registration error'),
                message: gettext('You must agree with Terms and Conditions as well as confirm that you are at least 18 years old'),
                wlcElement: 'notification_registration-terms-error',
            },
        });

        return false;
    }
}
