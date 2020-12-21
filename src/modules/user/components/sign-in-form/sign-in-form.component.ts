import {
    Component,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    LogService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import * as Params from './sign-in-form.params';

import {
    union as _union,
} from 'lodash';

/**
 * Sign-in form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-sign-in-form',
 * }
 *
 */

@Component({
    selector: '[wlc-sign-in-form]',
    templateUrl: './sign-in-form.component.html',
    styleUrls: ['./styles/sign-in-form.component.scss'],
})
export class SignInFormComponent extends AbstractComponent {

    public $params: Params.ISignInFormCParams;
    public config = Params.signInFormConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignInFormCParams,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected logService: LogService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {email, login, password} = form.value;

        //TODO: Add login parameter by phone number
        const loginParam = email ? email : login;

        try {
            await this.userService.login(loginParam, password);
            this.modalService.closeModal('login');
        } catch (error) {
            this.modalService.closeModal('login');
            this.modalService.showError({
                modalMessage: error.errors,
            });

            this.logService.sendLog({code: '1.2.0', data: error});
        }
    }
}
