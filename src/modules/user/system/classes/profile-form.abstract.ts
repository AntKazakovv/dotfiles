import {FormGroup} from '@angular/forms';

import _isUndefined from 'lodash-es/isUndefined';
import _some from 'lodash-es/some';
import _keys from 'lodash-es/keys';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

export abstract class ProfileFormAbstract extends AbstractComponent {

    constructor(
        mixedParams: IMixedParams<unknown>,
        protected eventService: EventService,
        protected userService: UserService,
        protected configService?: ConfigService,
    ) {
        super(mixedParams, configService);
    }

    /**
     * Method is called before submit form
     * @param form {FormGroup}
     * @returns {boolean} boolean
     */
    public beforeSubmit(form: FormGroup): boolean {
        const userProfile = this.userService.userProfile$.getValue();

        const isNewValues = _some(
            _keys(form.value),
            (key: string) => !_isUndefined(userProfile[key]) && userProfile[key] !== form.value[key],
        );

        if (!isNewValues) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Info'),
                    message: gettext('There are no changes to save'),
                    wlcElement: 'notification_profile-update-error',
                },
            });
        }

        return isNewValues;
    }
}
