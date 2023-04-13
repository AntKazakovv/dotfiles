import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {
    AbstractComponent,
    ConfigService,
    IFormWrapperCParams,
    EventService,
    NotificationEvents,
    IPushMessageParams,
    ModalService,
} from 'wlc-engine/modules/core';

import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

import * as Params from './password-confirmation-form.params';

@Component({
    selector: '[wlc-password-confirmation-form]',
    templateUrl: './password-confirmation-form.component.html',
    styleUrls: ['./styles/password-confirmation-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PasswordConfirmationFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams!: Params.IPasswordConfirmationFormCParams;

    public override $params!: Params.IPasswordConfirmationFormCParams;
    public config!: IFormWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPasswordConfirmationFormCParams,
        configService: ConfigService,
        protected userService: UserService,
        protected eventService: EventService,
        protected modalService: ModalService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.config = this.$params.formConfig;
    }

    /**
     * Sends request to complete email verification for unauthorized user
     *
     * @param {FormGroup} form
     */
    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const password: string = form.value.password;

        try {
            form.disable();
            const data = {code: this.$params.code, password: password};
            await this.userService.emailVerification(data);
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Email verification success'),
                    message: gettext('Your email has been successfully verified!'),
                    wlcElement: 'notification_email-verification-success',
                },
            });
            this.modalService.hideModal('password-confirmation');
            this.eventService.emit({name: 'LOGIN'});
            return true;
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data:<IPushMessageParams> {
                    type: 'error',
                    title: gettext('Email verification failure'),
                    message: error.errors,
                    wlcElement: 'notification_email-verification-failure',
                },
            });
            return false;
        } finally {
            form.enable();
            this.cdr.markForCheck();
        }
    }
}
