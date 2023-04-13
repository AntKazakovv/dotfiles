import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    takeUntil,
    filter,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

import * as Params from './email-field.params';

@Component({
    selector: '[wlc-email-field]',
    templateUrl: './email-field.component.html',
    styleUrls: ['./styles/email-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EmailFieldComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams!: Params.IEmailFieldCParams;
    public override $params!: Params.IEmailFieldCParams;
    public verificationBtn: boolean = false;
    public buttonDisabled: boolean = false;
    public emailControl!: UntypedFormControl;
    public isVerified!: boolean;
    protected profileEmail!: string;
    protected isExisted: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IEmailFieldCParams,
        configService: ConfigService,
        protected userService: UserService,
        protected eventService: EventService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.emailControl = this.$params.email.control;

        this.userService.userProfile$
            .pipe(
                filter((profile: UserProfile): boolean => !!profile),
                takeUntil(this.$destroy),
            )
            .subscribe(((profile: UserProfile): void => {
                this.isVerified = profile.emailVerified;

                if (!profile.email) {
                    this.setModifiers('no-mail');
                    this.emailControl.enable();
                }

                if (!this.isVerified && profile.email) {
                    this.setModifiers('unverified');
                    this.verificationBtn = true;
                    this.isExisted = true;
                } else {
                    this.verificationBtn = false;
                }
            }));
    }

    /**
     * Sends request to generate confirmation link which will be sent to the user
     * for email verification
     */
    public sendLink(): void {
        this.profileEmail = this.emailControl.value;

        if (this.emailControl.valid || this.isExisted) {
            this.mailVerify();
        } else {
            const message: string = this.emailControl.errors?.required
                ? gettext('Email is empty')
                : gettext('Email is incorrect');

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Email field filling error'),
                    message: message,
                    wlcElement: 'notification_email-verification-filling-error',
                },
            });
        }
    }

    protected async mailVerify(): Promise<void> {
        try {
            this.buttonDisabled = true;
            await this.userService.emailVerification();

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Email verification link sending'),
                    message: gettext(
                        'A mail with a verification link has been sent to your email address. '
                        + 'If you have not received an email, please check your spam folder.'),
                    wlcElement: 'notification_email-verification-link-sending-success',
                },
            });
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Email verification link sending'),
                    message: error.errors,
                    wlcElement: 'notification_email-verification-link-sending-error',
                },
            });
        } finally {
            this.buttonDisabled = false;
        }
    }
}
