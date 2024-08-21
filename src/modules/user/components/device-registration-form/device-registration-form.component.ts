import {
    Component,
    Inject,
    ChangeDetectionStrategy,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _toNumber from 'lodash-es/toNumber';

import {
    AbstractComponent,
    LogService,
    EventService,
    ModalService,
    IPushMessageParams,
    NotificationEvents,
    IFormWrapperCParams,
    ITimerCParams,
    DataService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './device-registration-form.params';

@Component({
    selector: '[wlc-device-registration-form]',
    templateUrl: './device-registration-form.component.html',
    styleUrls: ['./styles/device-registration-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceRegistrationFormComponent extends AbstractComponent implements OnInit {
    public override $params!: Params.IDeviceRegistrationFormCParams;
    public config: IFormWrapperCParams = Params.deviceRegistrationFormConfig;
    public userAgent: string = this.window.navigator.userAgent;
    public location: string = this.configService.get<string>('appConfig.country');
    public timerValue!: Dayjs;
    public buttonDisabled!: boolean;
    public timerParams: ITimerCParams = Params.timerParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDeviceRegistrationFormCParams,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected logService: LogService,
        protected dataService: DataService,
        @Inject(WINDOW) private window: Window,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.$params.buttonParams.pending$ = new BehaviorSubject(false);
        this.setTimer();

        this.eventService.subscribe({name: 'RESEND_CODE'}, (): void => {
            this.$params.buttonParams.pending$.next(false);
            this.setTimer();
        });
    }

    /**
     * Method called after timer expiry
     */
    public timerExpiry(): void {
        this.buttonDisabled = false;
        this.cdr.markForCheck();
    };

    /**
     * Method called on button click
     */
    public async buttonClick(): Promise<void> {
        this.$params.buttonParams.pending$.next(true);
        await this.userService.login(this.$params.login, this.$params.password);
    }

    /**
     * Form sending method
     * @param form {FormGroup}
     */
    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const regCode: number = _toNumber(form.controls.code.value);

        try {
            if (!this.userService.isAuth$.getValue() && this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.setNonceToLocalStorage();
            }

            form.disable();
            await this.userService.deviceRegistration(regCode, this.$params.login);

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Device verification'),
                    message: gettext('Device has been successfully verified!'),
                    wlcElement: 'notification_device-registration-success',
                },
            });

            if (this.modalService.getActiveModal('device-registration')) {
                this.modalService.hideModal('device-registration');
            }
            this.eventService.emit({name: 'LOGIN'});
            return true;
        } catch (error) {
            if (!this.userService.isAuth$.getValue() && this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.deleteNonceFromLocalStorage();
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Device verification failure'),
                    message: error.errors,
                    wlcElement: 'notification_device-registration-error',
                },
            });
            this.logService.sendLog({code: '1.9.0', data: error});
            return false;
        } finally {
            form.enable();
        }
    }

    protected setTimer(): void {
        this.buttonDisabled = true;
        this.timerValue = dayjs().add(1, 'minute');
        this.cdr.markForCheck();
    }
}
