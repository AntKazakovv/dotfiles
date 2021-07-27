import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DateTime} from 'luxon';
import {interval, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    ConfigService,
    EventService,
    LogService,
    AbstractComponent,
    TimerComponent,
    IPushMessageParams,
    NotificationEvents,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    SmsService,
    UserService,
    IRegFormDataForConfig,
} from 'wlc-engine/modules/user';
import {ISmsSendResponse} from '../../system/services/sms/sms.service';
import {
    UserActionsAbstract,
    IValidateData,
} from '../../system/classes/user-actions-abstract.class';

import * as Params from './sms-verification.params';

import _each from 'lodash-es/each';

/**
 * Sms verification component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-sms-verification',
 * }
 *
 */

@Component({
    selector: '[wlc-sms-verification]',
    templateUrl: './sms-verification.component.html',
    styleUrls: ['./styles/sms-verification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsVerificationComponent extends UserActionsAbstract<Params.ISmsVerificationCParams> implements OnInit {

    @Input() public inlineParams: Params.ISmsVerificationCParams;
    @ViewChild(TimerComponent) public timer: TimerComponent;
    public $params: Params.ISmsVerificationCParams;
    public config: IFormWrapperCParams;
    public configCode = Params.smsVerificationFormCodeConfig;
    public codeSended: boolean = false;
    public timeValue: DateTime;
    public lockResend: boolean;
    protected resendChecker: Subscription;
    protected phoneCode: string;
    protected phoneNumber: string;
    protected formData: IValidateData;
    protected smsToken: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISmsVerificationCParams,
        protected userService: UserService,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
        protected cdr: ChangeDetectorRef,
        protected smsService: SmsService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, userService, eventService, logService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.config = this.$params.formConfig || Params.smsVerificationFormConfig;
        this.configCode = this.$params.codeConfig || Params.smsVerificationFormCodeConfig;
    }

    /**
     * Send sms code
     *
     * @param {FormGroup} form Enter phone number form data
     *
     * @return {Promise} void
     */
    public async sendCode(form: FormGroup): Promise<void> {
        this.phoneCode = form.value.phoneCode;
        this.phoneNumber = form.value.phoneNumber;
        if (!this.phoneCode || !this.phoneNumber) {
            form.markAllAsTouched();
            return;
        }
        form.disable();
        const response = await this.smsService.send(this.phoneCode, this.phoneNumber);
        if (response?.status) {
            await this.senderActions(response, false);
        }
        form.enable();
    }

    /**
     * Validate sms code
     *
     * @param {FormGroup} form Enter sms code form data
     *
     * @return {Promise} void
     */
    public async submitCode(form: FormGroup): Promise<void> {
        const smsCode = form.value.code;
        if (!smsCode ) {
            form.markAllAsTouched();
            return;
        }

        try {
            form.disable();
            const response = await this.smsService.validate(this.smsToken, smsCode, this.phoneCode, this.phoneNumber);
            if (response?.status) {
                await this.userService.registration(this.formData);
                await this.finishUserReg(this.formData.data);
            } else {
                setTimeout(() => form.controls.code.setErrors({'wrong-sms-code': true}));
            }
        } catch (error) {
            this.showRegError(error);
        } finally {
            form.enable();
        }
    }

    /**
     * Resend sms code
     *
     * @return {Promise} void
     */
    public async resendCode(): Promise<void> {
        const response = await this.smsService.send(this.phoneCode, this.phoneNumber);
        if (response?.status) {
            await this.senderActions(response, true);
        }
        if (response?.token) {
            this.smsToken = response.token;
            this.setResendTimeout();
        }
    }

    protected setResendTimeout(): void {
        this.lockResend = true;
        this.timeValue = DateTime.now().plus({minutes: 1});
        if (this.timer) {
            this.timer.value = this.timeValue;
            this.timer.ngOnInit();
        }
        this.cdr.detectChanges();

        this.resendChecker = interval(1000).pipe(takeUntil(this.$destroy)).subscribe(() => {
            if (this.timeValue.toMillis() <= DateTime.local().toMillis()) {
                this.resendChecker.unsubscribe();
                this.lockResend = false;
                this.cdr.markForCheck();
            }
        });
    }

    protected createFormData(): void {
        const formValues = this.configService.get<IRegFormDataForConfig>('regFormData');
        this.formData = formValues.form;
        this.formData.data['phoneCode'] = this.phoneCode;
        this.formData.data['phoneNumber'] = this.phoneNumber;
        this.formData.data['phoneVerified'] = true;
        this.formData.fields.push('phoneCode');
        this.formData.fields.push('phoneNumber');
    }

    protected showError(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('SMS verification'),
                message: [gettext('Something went wrong. Please try again later.')],
                wlcElement: 'sms-sended-error',
            },
        });
    }

    protected async senderActions(res: ISmsSendResponse, isResend: boolean): Promise<void> {
        if (res.token) {
            const check = await this.smsService.checkState(res.token);
            if (check) {
                this.smsToken = res.token;
                if (!isResend) {
                    this.codeSended = true;
                    this.createFormData();
                }
                this.setResendTimeout();
            } else {
                this.showError();
            }
        } else {
            this.showError();
        }
    }
}
