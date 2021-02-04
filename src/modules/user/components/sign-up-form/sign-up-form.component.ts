import {
    Component,
    Inject,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';

import * as Params from './sign-up-form.params';

import {
    keys as _keys,
} from 'lodash-es';

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
export class SignUpFormComponent extends AbstractComponent {

    public config = Params.signUpFormConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignUpFormCParams,
        protected userService: UserService,
        protected logService: LogService,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        try {
            await this.userService.registration(this.formDataPreparation(form));
            this.userService.setProfileData(form.value);

            if (!this.checkConfirmation(form)) {
                return;
            }

            await this.userService.createUserProfile(this.userService.userProfile.data);

            if (this.isFastRegistration) {
                this.eventService.emit({name: 'LOGIN'});
            } else {
                this.registrationComplete();
            }
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Registration error'),
                    message: error.errors,
                },
            });

            this.logService.sendLog({code: '2.1.0', data: error});
        }
    }

    protected formDataPreparation(form: FormGroup): object {
        const formData = {
            'TYPE': 'user-register',
            data: {...form.value},
            fields: _keys(form.value),
        };

        return formData;
    }


    protected get isFastRegistration(): number {
        return this.configService.get<number>('appConfig.siteconfig.fastRegistration');
    }

    protected registrationComplete(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('User registration'),
                message: [
                    gettext('Your account has been registered.'),
                    gettext('Please complete registration using link in e-mail'),
                ],
            },
        });

        if (this.modalService.getActiveModal('signup')) {
            this.modalService.closeModal('signup');
        }
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
                title: gettext('User registration'),
                message: gettext('You must agree with Terms and Conditions as well as confirm that you are at least 18 years old'),
            },
        });

        return false;
    }
}
