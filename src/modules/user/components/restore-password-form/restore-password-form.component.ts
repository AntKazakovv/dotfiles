import {
    Component,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import * as Params from './restore-password-form.params';

import {
    union as _union,
} from 'lodash';

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
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {email} = form.value;

        try {
            await this.userService.sendPasswordRestore(email);
            this.modalService.closeAllModals();
        } catch (error) {
            this.modalService.closeAllModals();
            this.modalService.showError({
                modalMessage: error.errors,
            });
        }
    }
}
