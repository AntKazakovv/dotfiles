import {
    Component,
    Inject,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService, ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';

import * as Params from './restore-password-form.params';

import {
    union as _union,
} from 'lodash-es';

/**
 * Restore-password form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-restore-password-form',
 * }
 *
 */

@Component({
    selector: '[wlc-restore-password-form]',
    templateUrl: './restore-password-form.component.html',
    styleUrls: ['./styles/restore-password-form.component.scss'],
})
export class RestorePasswordFormComponent extends AbstractComponent {

    public $params: Params.IRestorePasswordFormCParams;
    public config = Params.restorePasswordFormConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRestorePasswordFormCParams,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected userService: UserService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {email} = form.value;

        try {
            form.disable();
            const response = await this.userService.sendPasswordRestore(email);
            this.modalService.closeModal('restore-password');

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Password reset success'),
                    message: response.data.result,
                    wlcElement: 'notification_password-reset-success',
                },
            });
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Password reset failed'),
                    message: error.errors,
                    wlcElement: 'notification_password-reset-error',
                },
            });
        } finally {
            form.enable();
        }
    }
}
