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

import * as Params from './change-password-form.params';

import {
    union as _union,
} from 'lodash-es';

/**
 * Change-password form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-change-password-form',
 * }
 *
 */

@Component({
    selector: '[wlc-change-password-form]',
    templateUrl: './change-password-form.component.html',
    styleUrls: ['./styles/change-password-form.component.scss'],
})
export class ChangePasswordFormComponent extends AbstractComponent {

    @Input() public inlineParams: Params.IChangePasswordFormCParams;
    public $params: Params.IChangePasswordFormCParams;
    public config = Params.changePasswordFormConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IChangePasswordFormCParams,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {currentPassword, confirmPassword} = form.value;

        try {
            await this.userService.setNewPassword(currentPassword, confirmPassword);

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Password changed successfully'),
                    message: gettext('Your password has been changed successfully!'),
                },
            });

            if (this.modalService.getActiveModal('change-password')) {
                this.modalService.closeModal('change-password');
            }
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Failed to change password'),
                    message: error.errors,
                },
            });
        }
    }
}
