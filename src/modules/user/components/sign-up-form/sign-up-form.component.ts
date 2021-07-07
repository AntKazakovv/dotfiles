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
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';

import * as Params from './sign-up-form.params';

import _keys from 'lodash-es/keys';

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
export class SignUpFormComponent extends AbstractComponent implements OnInit {

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
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit({});
        this.config = this.$params.formConfig || Params.signUpFormConfig;
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        try {
            form.disable();

            const regData = this.formDataPreparation(form);
            await this.userService.registration(regData);
            this.userService.setProfileData(regData.data);

            if (!this.checkConfirmation(form)) {
                return;
            }

            await this.userService.createUserProfile(this.userService.userProfile.data);

            this.userService.finishRegistration();

        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Registration error'),
                    message: error.errors,
                    wlcElement: 'notification_registration-error',
                },
            });

            this.logService.sendLog({code: '2.1.0', data: error});
        } finally {
            form.enable();
        }
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
