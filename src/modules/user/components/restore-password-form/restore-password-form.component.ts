import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import _cloneDeep from 'lodash-es/cloneDeep';

import {
    IFormWrapperCParams,
    AbstractComponent,
    EventService,
    ModalService,
    ConfigService,
    IPushMessageParams,
    NotificationEvents,
    IIndexing,
    IData,
    emailRegex,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

import * as Params from './restore-password-form.params';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestorePasswordFormComponent extends AbstractComponent implements OnInit {

    public $params: Params.IRestorePasswordFormCParams;
    public config: IFormWrapperCParams = _cloneDeep(Params.restorePasswordFormConfig);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRestorePasswordFormCParams,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected userService: UserService,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();

        if (this.configService.get<boolean>('$base.profile.smsVerification.useRestorePassword')) {
            this.config = _cloneDeep(Params.restorePasswordWithPhoneFormConfig);
        }
    }

    /**
     * Submit handler
     * @param form `FormGroup`
     */
    public async ngSubmit(form: FormGroup): Promise<void> {
        let {email, emailOrPhone}: IIndexing<string> = form.value;
        let phone: string;

        if (emailOrPhone && !email && this.isEmail(emailOrPhone)) {
            email = emailOrPhone;
        } else {
            phone = emailOrPhone;
        }

        form.disable();

        try {
            if (email && await this.doesEmailExist(email)) {
                setTimeout(() => form.controls.email.setErrors({'email-not-exist': true}));
                this.cdr.markForCheck();
                return;
            }

            await this.userService.sendPasswordRestore(email, phone);

            this.modalService.hideModal('restore-password');

            let message: string, title: string;

            if (phone) {
                title = gettext('Password restore');
                message = gettext('The code has been sent successfully.');
            } else {
                title = gettext('Password reset success');
                message = this.configService.get<boolean>('appConfig.hideEmailExistence')
                    ? gettext(
                        'Recovery link has been sent to the entered e-mail address. '
                        + 'If you didn’t receive it, please make sure you’ve used correct email address, '
                        + 'or check your spam/junk folder.',
                    )
                    : gettext('A password reset link will be sent to your e-mail address shortly.');
            }

            this.pushMessage({
                type: 'success',
                title: title,
                message: message,
                wlcElement: 'notification_password-reset-success',
            });

            if (phone) {
                this.modalService.showModal('restore-sms-code', {phone});
            }
        } catch (error) {
            this.pushMessage({
                type: 'error',
                title: gettext('Password reset failed'),
                message: error.errors,
                wlcElement: 'notification_password-reset-error',
            });
        } finally {
            form.enable();
            this.cdr.markForCheck();
        }
    }

    protected async doesEmailExist(email: string): Promise<boolean> {
        const isHideEmailExistence: boolean = this.configService.get<boolean>('appConfig.hideEmailExistence');
        if (isHideEmailExistence) {
            return false;
        }
        const response: IData = await this.userService.emailUnique(email);

        if (response.data.result) {
            this.pushMessage({
                type: 'error',
                title: gettext('Error'),
                message: gettext('An account with this e-mail does not exist'),
            });
        }

        return response.data.result;
    }

    protected isEmail(value: string): boolean {
        return emailRegex.test(value);
    }

    protected pushMessage(params: IPushMessageParams): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: params,
        });
    }
}
