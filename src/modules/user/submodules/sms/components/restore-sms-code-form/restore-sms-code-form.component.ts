import {FormGroup} from '@angular/forms';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';

import {DateTime} from 'luxon';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IFormWrapperCParams,
    IPushMessageParams,
    ModalService,
    NotificationEvents,
    TimerComponent,
    InjectionService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';

import * as Params from './restore-sms-code-form.params';

@Component({
    selector: '[wlc-restore-sms-code-form]',
    templateUrl: './restore-sms-code-form.component.html',
    styleUrls: ['./styles/restore-sms-code-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestoreSmsCodeFormComponent extends AbstractComponent implements OnInit {
    @ViewChild(TimerComponent) public timer: TimerComponent;

    public $params: Params.IRestoreSmsCodeFormCParams;
    public lockResend: boolean;
    public timeValue: DateTime;
    public formConfig: IFormWrapperCParams;
    protected userService: UserService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRestoreSmsCodeFormCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.formConfig = Params.formConfig;
        this.setResendTimer();
    }

    /**
     * Handler on timer complete
     */
    public timerCompletedHandler(): void {
        this.lockResend = false;
        this.cdr.markForCheck();
    }

    /**
     * Send form - validate code and open new password modal
     * @param form - `FormGroup`
     */
    public async sendCode(form: FormGroup): Promise<boolean> {
        const code = form.value.code;

        try {
            form.disable();

            if (!this.userService) {
                this.userService = await this.injectionService.getService<UserService>('user.user-service');
            }

            await this.userService.validateRestoreCode(code);

            this.modalService.showModal('newPassword', {
                wlcElement: 'form_forgot-password',
                common: {code},
            });
            return true;
        } catch (error) {
            this.pushMessage({
                type: 'error',
                title: gettext('Password restore'),
                message: error.errors,
                wlcElement: 'notification_password-reset-success',
            });
            return false;
        } finally {
            form.enable();
        }
    }

    /**
     * Resend code to phone number and restart timer
     */
    public async resendCode(): Promise<void> {
        if (!this.$params.phone) {
            return;
        }

        try {
            if (!this.userService) {
                this.userService = await this.injectionService.getService<UserService>('user.user-service');
            }

            await this.userService.sendPasswordRestore(null, this.$params.phone);

            this.pushMessage({
                type: 'success',
                title: gettext('Password restore'),
                message: gettext('The code has been sent successfully.'),
                wlcElement: 'notification_password-reset-success',
            });

            this.setResendTimer();
        } catch (error) {
            this.pushMessage({
                type: 'error',
                title: gettext('Password restore'),
                message: error.errors,
                wlcElement: 'notification_password-reset-success',
            });
        }
    }

    protected pushMessage(params: IPushMessageParams): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: params,
        });
    }

    protected setResendTimer(): void {
        this.lockResend = true;
        this.timeValue = DateTime.now().plus({minutes: 1});
        if (this.timer) {
            this.timer.value = this.timeValue;
            this.timer.ngOnInit();
        }
        this.cdr.markForCheck();
    }

}
