import {
    Directive,
    ChangeDetectorRef,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import _keys from 'lodash-es/keys';
import _isArray from 'lodash-es/isArray';
import _isString from 'lodash-es/isString';
import _toString from 'lodash-es/toString';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IUserProfile,
    IExtProfile,
} from 'wlc-engine/modules/core/system/interfaces/user.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
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
        configService: ConfigService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected logService: LogService,
        protected userService: UserService,
        cdr?: ChangeDetectorRef,
    ) {
        super(componentParams, configService, cdr);
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

    protected async checkConfirmation(form: UntypedFormGroup): Promise<boolean> {
        const formValues: IIndexing<number | string | boolean> = form.getRawValue();
        let {ageConfirmed, agreedWithTermsAndConditions} = formValues;

        if (['birthYear', 'birthDay', 'birthMonth'].every(el => el in formValues)) {
            ageConfirmed = this.userService.isAgeLegal(formValues);
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

    protected formDataPreparation(form: UntypedFormGroup): IValidateData {
        const formValues: IIndexing<number | string | boolean> = form.getRawValue();

        if (!form.controls.hasOwnProperty('passwordRepeat')) {
            formValues.passwordRepeat = formValues.password;
        }

        const extProfile: IExtProfile = {};

        if (formValues.login && this.configService.get('$base.registration.autocompleteNick')) {
            formValues.nick = formValues.login;
        }

        if (formValues.nick && _isString(formValues.nick)) {
            extProfile.nick = formValues.nick;
            delete formValues.nick;
        }

        const formData: IValidateData = {
            'TYPE': 'user-register',
            data: {
                ...formValues,
                extProfile: _keys(extProfile).length ? extProfile : null,
            },
            fields: _keys(formValues),
        };

        const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);

        if (chosenBonus?.id) {
            formData.data.registrationBonus = _toString(chosenBonus.id);
            formData.fields.push('registrationBonus');
        }
        return formData;
    }
}
