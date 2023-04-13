import {
    Directive,
    ChangeDetectorRef,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {StateService} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import {BehaviorSubject} from 'rxjs';
import _isObject from 'lodash-es/isObject';
import _assign from 'lodash-es/assign';

import {UserService} from 'wlc-engine/modules/user';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {CaptchaService} from 'wlc-engine/modules/security/captcha';
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

@Directive()
export abstract class SignInFormAbstract<T extends IAbstractSignInFormCParams<unknown, unknown, unknown>>
    extends AbstractComponent {

    public override $params: T;
    public config: IFormWrapperCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);

    private captchaService?: CaptchaService;
    private captchaError: boolean = false;

    constructor(
        mixedParams: IMixedParams<T>,
        protected injectionService: InjectionService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected stateService: StateService,
        protected translateService: TranslateService,
        configService?: ConfigService,
        cdr?: ChangeDetectorRef,
    ) {
        super(mixedParams, configService, cdr);
    }

    public beforeSubmit(form: UntypedFormGroup): boolean {
        if (this.captchaError) {
            const captcha = form.controls.captcha;

            if (!captcha.value.match(/^[\dA-z]+$/gi)) {
                this.errors$.next({captcha: this.translateService.instant(this.$params.captchaErrorText)});
                this.notificationLoginError(this.translateService.instant(this.$params.captchaErrorText));

                return false;
            }
        }

        return true;
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
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
                this.modalService.hideModal('login', 'submit');
            }

            return true;
        } catch (error) {
            const errors: IIndexing<string> = error.errors;
            let errorMessage: string | IIndexing<string>;

            if (errors?.captcha) {
                errorMessage = captcha ? this.$params.captchaErrorText : this.$params.captchaCreatingText;
                errorMessage = this.translateService.instant(errorMessage);
                await this.onCaptchaError(errors.captcha);
            } else if (error.code === 418) {
                this.modalService.showModal('deviceRegistration', {login: email || login, password: password});

                return false;
            } else {
                errorMessage = errors;
            }

            this.notificationLoginError(errorMessage);

            if (_isObject(errors)) {
                this.errors$.next(errors.captcha
                    ? {captcha: this.translateService.instant(this.$params.captchaErrorText)}
                    : errors,
                );
            }

            return false;
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
                displayAsHTML: true,
            },
        });
    }

    private async onCaptchaError(error: string): Promise<void> {
        if (!this.captchaService) {
            this.captchaService = await this.injectionService.getService('captcha.captcha-service');
        }

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
