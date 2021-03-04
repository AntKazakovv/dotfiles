import {
    Component,
    Inject,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {StateService} from '@uirouter/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    EventService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';

import * as Params from './new-password-form.params';


/**
 * Set new-password form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-new-password-form',
 * }
 *
 */

@Component({
    selector: '[wlc-new-password-form]',
    templateUrl: './new-password-form.component.html',
    styleUrls: ['./styles/new-password-form.component.scss'],
})
export class NewPasswordFormComponent extends AbstractComponent {

    @Input() public inlineParams: Params.INewPasswordFormCParams;
    public $params: Params.INewPasswordFormCParams;
    public config = Params.newPasswordFormConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.INewPasswordFormCParams,
        protected stateService: StateService,
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
        const {newPassword, confirmPassword} = form.value;
        const code = this.injectParams.common.code;

        try {
            form.disable();
            await this.userService.restoreNewPassword(newPassword, confirmPassword, code);

            this.stateService.go('app.home');
            this.eventService.emit({name: 'LOGIN'});

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Password reset'),
                    message: gettext('Password has been changed!'),
                },
            });

            if (this.modalService.getActiveModal('new-password')) {
                this.modalService.closeModal('new-password');
            }

        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Password reset failed'),
                    message: error.errors,
                },
            });
        } finally {
            form.enable();
        }
    }
}
