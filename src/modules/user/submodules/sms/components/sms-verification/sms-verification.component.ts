import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {
    interval,
    Subscription,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    EventService,
    LogService,
    TimerComponent,
    IPushMessageParams,
    NotificationEvents,
    IFormWrapperCParams,
    ModalService,
    DataService,
    UserActionsAbstract,
    IValidateData,
    InjectionService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {IRegFormDataForConfig} from 'wlc-engine/modules/user/submodules/signup';
import {ISmsSendResponse} from 'wlc-engine/modules/user/submodules/sms/system/interfaces/sms-responses.interface';
import {SmsService} from 'wlc-engine/modules/user/submodules/sms/system/services/sms/sms.service';

import * as Params from './sms-verification.params';

/**
 * Sms verification component.
 *
 * @example
 *
 * {
 *     name: 'sms.wlc-sms-verification',
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
    public override $params: Params.ISmsVerificationCParams;
    public config: IFormWrapperCParams;
    public configCode = Params.smsVerificationFormCodeConfig;
    public codeSended: boolean = false;
    public timeValue: Dayjs;
    public lockResend: boolean;

    protected resendChecker: Subscription;
    protected phoneCode: string;
    protected phoneNumber: string;
    protected formDataValidate: IValidateData;
    protected smsToken: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISmsVerificationCParams,
        userService: UserService,
        eventService: EventService,
        logService: LogService,
        injectionService: InjectionService,
        protected smsService: SmsService,
        protected modalService: ModalService,
        protected dataService: DataService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, eventService, injectionService, logService, userService);
    }

    public override ngOnInit(): void {
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
    public async sendCode(form: UntypedFormGroup): Promise<boolean> {
        this.phoneCode = form.value.phoneCode;
        this.phoneNumber = form.value.phoneNumber;
        if (!this.phoneCode || !this.phoneNumber) {
            form.markAllAsTouched();
            return false;
        }
        form.disable();
        const response = await this.smsService.send(this.phoneCode, this.phoneNumber);
        if (response?.status) {
            await this.senderActions(response, false);
        }
        form.enable();
        return true;
    }

    /**
     * Validate sms code
     *
     * @param {FormGroup} form Enter sms code form data
     *
     * @return {Promise} void
     */
    public async submitCode(form: UntypedFormGroup): Promise<boolean> {
        const smsCode = form.value.code;
        if (!smsCode) {
            form.markAllAsTouched();
            return false;
        }

        try {
            form.disable();

            if (!this.userService.isAuth$.getValue() && this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.setNonceToLocalStorage();
            }

            const response = await this.smsService.validate(this.smsToken, smsCode, this.phoneCode, this.phoneNumber);
            if (response?.status) {
                if (this.$params.functional === 'profile') {
                    if (!this.userService) {
                        this.userService = await this.injectionService.getService<UserService>('user.user-service');
                    }

                    const result = await this.userService.updateProfile({
                        phoneCode: this.phoneCode,
                        phoneNumber: this.phoneNumber,
                        phoneVerified: true,
                    }, {updatePartial: true});

                    if (result) {
                        this.eventService.emit({
                            name: NotificationEvents.PushMessage,
                            data: <IPushMessageParams>{
                                type: 'success',
                                title: gettext('Profile updated successfully'),
                                message: gettext('Your profile has been successfully updated'),
                                wlcElement: 'notification_profile-update-success',
                            },
                        });

                        if (this.modalService.getActiveModal('sms-verification')) {
                            this.modalService.hideModal('sms-verification');
                        }

                        this.cdr.detectChanges();
                    }
                } else {
                    if (!this.userService) {
                        this.userService = await this.injectionService.getService<UserService>('user.user-service');
                    }

                    await this.userService.validateRegistration(this.formDataValidate);
                    await this.finishUserReg(this.formDataValidate.data);
                }

            } else {
                setTimeout(() => form.controls.code.setErrors({'wrong-sms-code': true}));
            }
            return true;
        } catch (error) {
            if (!this.userService.isAuth$.getValue() && this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.deleteNonceFromLocalStorage();
            }

            this.showRegError(error);
            return false;
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
        this.timeValue = dayjs().add(1, 'minute');
        if (this.timer) {
            this.timer.value = this.timeValue;
            this.timer.ngOnInit();
        }
        this.cdr.detectChanges();

        this.resendChecker = interval(1000).pipe(takeUntil(this.$destroy)).subscribe(() => {
            if (this.timeValue.unix() <= dayjs().unix()) {
                this.resendChecker.unsubscribe();
                this.lockResend = false;
                this.cdr.markForCheck();
            }
        });
    }

    protected createFormData(): void {
        const formValues = this.configService.get<IRegFormDataForConfig>('regFormData');
        this.formDataValidate = formValues.form;
        this.formDataValidate.data['phoneCode'] = this.phoneCode;
        this.formDataValidate.data['phoneNumber'] = this.phoneNumber;
        this.formDataValidate.data['phoneVerified'] = true;
        this.formDataValidate.fields.push('phoneCode');
        this.formDataValidate.fields.push('phoneNumber');
    }

    protected showError(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('SMS verification'),
                message: [gettext('Something went wrong. Please try again later')],
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
                    if (this.$params.functional === 'registration') {
                        this.createFormData();
                    }
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
