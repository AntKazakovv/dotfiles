import {FormGroup} from '@angular/forms';

import _some from 'lodash-es/some';
import _keys from 'lodash-es/keys';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IIndexing,
    IMixedParams,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';

export abstract class ProfileFormAbstract extends AbstractComponent {

    constructor(
        mixedParams: IMixedParams<unknown>,
        protected eventService: EventService,
        protected configService?: ConfigService,
    ) {
        super(mixedParams, configService);
    }

    /**
     * Method is called before submit form
     * @param form {FormGroup}
     * @returns {boolean} boolean
     */
    public beforeSubmit(form: FormGroup, initialFormValues: IIndexing<any>): boolean {
        const isNewValues = _some(
            _keys(form.value),
            (key: string) => {
                if (key === 'currentPassword') {
                    return false;
                }

                return form.value[key] !== initialFormValues[key];
            },
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
