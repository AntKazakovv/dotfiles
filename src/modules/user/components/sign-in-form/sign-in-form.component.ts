import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    EventService,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {
    ConfigService,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import * as Params from './sign-in-form.params';

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
export class SignInFormComponent extends AbstractComponent implements OnInit {

    public $params: Params.ISignInFormCParams;
    public config = Params.signInFormConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISignInFormCParams,
        protected eventService: EventService,
        protected logService: LogService,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected userService: UserService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {email, login, password} = form.value;
        const loginParam = email ? email : login;

        try {
            form.disable();
            await this.userService.login(loginParam, password);
            this.modalService.hideModal('login');
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Login error'),
                    message: error.errors,
                    wlcElement: 'notification_login-error',
                },
            });

            this.logService.sendLog({code: '1.2.0', data: error});
        } finally {
            form.enable();
        }
    }
}
