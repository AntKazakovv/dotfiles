import {FormGroup} from '@angular/forms';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    EventService,
    LogService,
    NotificationEvents,
    IPushMessageParams,
    IUserProfile,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';

import _keys from 'lodash-es/keys';

export interface IValidateData {
    'TYPE': string,
    data: Partial<IUserProfile>,
    fields: string[],
};

export abstract class UserActionsAbstract<T> extends AbstractComponent {

    constructor(
        protected componentParams: IMixedParams<T>,
        protected configService: ConfigService,
        protected userService: UserService,
        protected eventService: EventService,
        protected logService: LogService,
    ) {
        super(componentParams, configService);
    }

    protected async finishUserReg(formValue: unknown): Promise<void> {
        this.userService.setProfileData(formValue);
        await this.userService.createUserProfile(this.userService.userProfile.data);
        this.userService.finishRegistration();
    }

    protected showRegError(
        error: {errors: string[]},
        code?: string,
        title?: string,
    ): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: title || gettext('Registration error'),
                message: error.errors,
                wlcElement: 'notification_registration-error',
            },
        });
        this.logService.sendLog({code: code || '2.1.0', data: error});
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

    protected formDataPreparation(form: FormGroup): IValidateData {
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
}
