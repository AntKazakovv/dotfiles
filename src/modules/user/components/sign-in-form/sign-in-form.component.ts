import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    EventService,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {
    ConfigService,
    IFormWrapperCParams,
    IPushMessageParams,
    NotificationEvents,
    IIndexing,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as Params from './sign-in-form.params';

import _some from 'lodash-es/some';
import _isObject from 'lodash-es/isObject';

/**
 * Sign-in form component.
 * Can be called via url path (/en/login) as a modal window or via modal service (showModal('login')).
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
    public config: IFormWrapperCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);

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
        this.config = this.$params.formConfig || Params.signInFormConfig;

        if (this.configService.get<boolean>('$base.profile.socials.use')) {
            this.addModifiers('socials');

            if (!_some(this.config.components, (el: IFormComponent) => el.name === 'user.wlc-social-networks')) {
                this.config.components.unshift({
                    name: 'user.wlc-social-networks',
                    params: {},
                });
            }
        }
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
            if (_isObject(error.errors)) {
                this.errors$.next(error.errors);
            }
        } finally {
            form.enable();
        }
    }
}
