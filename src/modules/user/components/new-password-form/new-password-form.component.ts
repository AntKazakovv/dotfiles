import {
    Component,
    Inject,
    Input,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {StateService} from '@uirouter/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {
    ConfigService,
    DataService,
} from 'wlc-engine/modules/core';

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
// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-new-password-form]',
    templateUrl: './new-password-form.component.html',
    styleUrls: ['./styles/new-password-form.component.scss'],
})
export class NewPasswordFormComponent extends AbstractComponent {

    @Input() public inlineParams: Params.INewPasswordFormCParams;
    public override $params: Params.INewPasswordFormCParams;
    public config = Params.newPasswordFormConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.INewPasswordFormCParams,
        protected stateService: StateService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
        configService: ConfigService,
        protected dataService: DataService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const {newPassword, repeatPassword} = form.value;
        const code = this.injectParams.common.code;

        try {
            form.disable();

            if (this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.setNonceToLocalStorage();
            }

            await this.userService.restoreNewPassword(newPassword, repeatPassword, code);

            if (this.configService.get<boolean>('$base.site.useJwtToken')) {
                this.modalService.showModal('login');
            } else {
                this.stateService.go('app.home');
                this.eventService.emit({name: 'LOGIN'});
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Password reset'),
                    message: gettext('Password has been changed!'),
                    wlcElement: 'notification_password-change-success',
                },
            });

            if (this.modalService.getActiveModal('new-password')) {
                this.modalService.hideModal('new-password');
            }
            return true;
        } catch (error) {
            if (this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.deleteNonceFromLocalStorage();
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Password reset failed'),
                    message: error.errors,
                    wlcElement: 'notification_password-change-error',
                },
            });
            return false;
        } finally {
            form.enable();
        }
    }
}
