import {Directive} from '@angular/core';
import {FormGroup} from '@angular/forms';

import _keys from 'lodash-es/keys';
import _isArray from 'lodash-es/isArray';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    EventService,
    LogService,
    NotificationEvents,
    IPushMessageParams,
    IUserProfile,
    IIndexing,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';
import {
    IProcessEventData,
    ProcessEvents,
    ProcessEventsDescriptions,
} from 'wlc-engine/modules/monitoring';

export interface IValidateData {
    'TYPE': string;
    data: Partial<IUserProfile>;
    fields: string[];
}

@Directive()
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
        error: {errors: string[]; code?: string},
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

        let msg: string = _isArray(error.errors) ? error.errors.toString() : null;
        msg ||= error.code ? `http ${error.code}` : null;
        msg ||= code ? `flog ${code}` : ProcessEventsDescriptions.noReason;
        this.eventService.emit({
            name: ProcessEvents.failTrigger,
            data: <IProcessEventData>{
                eventId: 'signup',
                description: ProcessEventsDescriptions.failTrigger + msg,
            },
        });
    }

    protected checkConfirmation(form: FormGroup): boolean {
        const formValues: IIndexing<number | string | boolean> = form.getRawValue();
        let {ageConfirmed, agreedWithTermsAndConditions} = formValues;

        if (['birthYear', 'birthDay', 'birthMonth'].every(el => el in formValues)) {
            ageConfirmed = this.userService.checkUserAge(formValues);
        }

        if (ageConfirmed && agreedWithTermsAndConditions) {
            return true;
        }

        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Registration error'),
                message: gettext('You must agree with Terms and Conditions '
                    + 'as well as confirm that you are at least 18 years old'),
                messageContext: {
                    age: this.configService.get('$base.profile.legalAge') || 18,
                },
                wlcElement: 'notification_registration-terms-error',
            },
        });

        return false;
    }

    protected formDataPreparation(form: FormGroup): IValidateData {
        const formValues: IIndexing<number | string | boolean> = form.getRawValue();

        if (!form.controls.hasOwnProperty('passwordRepeat')) {
            formValues.passwordRepeat = formValues.password;
        }

        const formData = {
            'TYPE': 'user-register',
            data: {...formValues},
            fields: _keys(formValues),
        };

        const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);

        if (chosenBonus?.id) {
            formData.data.registrationBonus = chosenBonus.id;
            formData.fields.push('registrationBonus');
        }
        return formData;
    }
}
