import {RawParams} from '@uirouter/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    EventService,
    LogService,
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core';
import {
    UserService,
} from 'wlc-engine/modules/user';

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

    protected showRegError(error: {errors: string[]}): void {
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
    }
}
