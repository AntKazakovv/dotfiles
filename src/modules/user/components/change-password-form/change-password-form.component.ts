import {
    Component,
    Inject,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';

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
        } catch (error) {
            this.modalService.showError({
                modalMessage: error.errors,
            });
        }
    }
}
