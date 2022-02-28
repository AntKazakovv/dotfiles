import {FormGroup} from '@angular/forms';
import {StateService} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import _isObject from 'lodash-es/isObject';
import _assign from 'lodash-es/assign';

import {UserService} from 'wlc-engine/modules/user';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {CaptchaService} from 'wlc-engine/modules/core/system/services/captcha/captcha.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    IFormComponent,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {
    AbstractComponent,
    IMixedParams,
} from './abstract.component';

/** component captcha insertion settings */
export interface ICaptchaInsertParams {
    /** insert a captcha after this element in the array */
    insertAfter?: number;
    /** components to be inserted can be redefined on the project */
    components?: {
        captcha: IFormComponent,
        captchaInput: IFormComponent,
    };
}

interface IDefaultAbstractSignInCParams {
    /** component captcha insertion settings */
    captchaInsertConfig?: ICaptchaInsertParams,
    /** text to display a captcha error */
    captchaErrorText?: string,
    /** text to display a captcha creating */
    captchaCreatingText?: string,
}

export interface IAbstractSignInFormCParams<T, R, M> extends IDefaultAbstractSignInCParams, IComponentParams<T, R, M> {
}

export const defaultSignInFormParams: IDefaultAbstractSignInCParams = {
    captchaErrorText: gettext('Incorrect captcha'),
    captchaCreatingText: gettext('Enter the captcha'),
    captchaInsertConfig: {
        insertAfter: 4,
        components: {
            captcha: FormElements.captcha,
            captchaInput: FormElements.captchaInput,
        },
    },
};

export abstract class SignInFormAbstract<T extends IAbstractSignInFormCParams<unknown, unknown, unknown>>
    extends AbstractComponent {

    public $params: T;
    public config: IFormWrapperCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);

    private captchaError: boolean = false;

    constructor(
        mixedParams: IMixedParams<T>,
        protected captchaService: CaptchaService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected stateService: StateService,
        protected configService?: ConfigService,
    ) {
        super(mixedParams, configService);
    }

    public beforeSubmit(form: FormGroup): boolean {
        if (this.captchaError) {
            const captcha = form.controls.captcha;

            if (!captcha.value.match(/^[\dA-z]+$/gi)) {
                this.errors$.next({captcha: this.$params.captchaErrorText});
                this.notificationLoginError(this.$params.captchaErrorText);

                return false;
            }
        }

        return true;
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {email, login, password, captcha} = form.value;

        if (captcha) {
            this.captchaService.captchaCode = captcha;
        }

        try {
            form.disable();
            await this.userService.login(email || login, password);

            if (this.stateService.is('app.signin')) {
                this.stateService.go('app.home');
            } else if (this.modalService.getActiveModal('login')) {
                this.modalService.hideModal('login');
            }
        } catch (error) {
            const errors: IIndexing<string> = error.errors;
            let errorMessage: string | IIndexing<string>;

            if (errors?.captcha) {
                errorMessage = captcha ? this.$params.captchaErrorText : this.$params.captchaCreatingText;
                this.onCaptchaError(errors.captcha);
            } else {
                errorMessage = errors;
            }

            this.notificationLoginError(errorMessage);

            if (_isObject(errors)) {
                this.errors$.next(errors.captcha ? {captcha: this.$params.captchaErrorText} : errors);
            }
        } finally {
            form.enable();
        }
    }

    protected notificationLoginError(message: string | string[] | IIndexing<string>): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Login error'),
                message,
                wlcElement: 'notification_login-error',
            },
        });
    }

    private onCaptchaError(error: string): void {
        this.addCaptchaElements();

        this.captchaError = true;
        this.captchaService.captchaImageUrl = error;
    }

    private addCaptchaElements(): void {
        if (this.captchaError) {
            return;
        }

        const settings: ICaptchaInsertParams = this.$params.captchaInsertConfig;
        this.config.components.splice(
            settings.insertAfter, 0,
            settings.components.captcha,
            settings.components.captchaInput,
        );
        this.config = _assign({}, this.config);
    }
}
