import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {
    Observable,
} from 'rxjs';

import {
    IFormWrapperCParams,
    AbstractComponent,
    EventService,
    ModalService,
    IPushMessageParams,
    NotificationEvents,
    IIndexing,
    IData,
    emailRegex,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {TimeLimitService} from 'wlc-engine/modules/user/system/services/time-limit/time-limit.service';

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

    public override $params: Params.IRestorePasswordFormCParams;
    public config: IFormWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRestorePasswordFormCParams,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected userService: UserService,
        protected timeLimitService: TimeLimitService,
    ) {

        super(<IMixedParams<Params.IRestorePasswordFormCParams>>{
            injectParams: injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.timeLimitService.setRestoreTimerTime(this.$params.requestTimer);

        if (this.configService.get<boolean>('$base.profile.smsVerification.useRestorePassword')) {
            this.config = this.$params.restorePasswordFormConfigs.withPhone;
        } else {
            this.config = this.$params.restorePasswordFormConfigs.default;
        }
    }

    /**
     * Submit handler
     * @param form `FormGroup`
     */
    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        let {email, emailOrPhone}: IIndexing<string> = form.value;
        let phone: string;
        const timerTime: number = this.$params.requestTimer;

        if (emailOrPhone && !email && this.isEmail(emailOrPhone)) {
            email = emailOrPhone;
        } else {
            phone = emailOrPhone;
        }

        form.disable();

        if (!this.timeLimitService.waitRestore) {
            try {
                if (email && await this.doesEmailExist(email)) {
                    setTimeout((): void => form.controls.email.setErrors({'email-not-exist': true}));
                    this.cdr.markForCheck();
                    return;
                }

                await this.userService.sendPasswordRestore(email, phone);

                this.modalService.hideModal('restore-password');

                let message: string;
                let title: string;

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
                this.timeLimitService.setTime('restorePassword');

                return true;
            } catch (error) {
                this.pushMessage({
                    type: 'error',
                    title: gettext('Password reset failed'),
                    message: error.errors,
                    wlcElement: 'notification_password-reset-error',
                });

                return false;
            } finally {
                form.enable();
                this.cdr.markForCheck();
            }
        } else {
            this.timeLimitService.showNotification(timerTime);
            form.enable();
        }
    }

    public get waitRestore$(): Observable<boolean> {
        return this.timeLimitService.waitRestore$;
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
