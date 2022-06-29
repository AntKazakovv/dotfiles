import {
    Component,
    Inject,
    OnInit,
    Input,
    AfterViewInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {skipWhile, takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    ConfigService,
    ContactsService,
    EventService,
    IIndexing,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {IContactsConfig} from 'wlc-engine/modules/core/system/interfaces';
import * as Params from './feedback-form.params';

/**
 * Feedback form component. The senderEmail, senderName, message, subject fields are required.
 *
 * @example
 *
 * {
 *     name: 'core.wlc-feedback-form',
 * }
 *
 */
@Component({
    selector: '[wlc-feedback-form]',
    templateUrl: './feedback-form.component.html',
    styleUrls: ['./styles/feedback-form.component.scss'],
})
export class FeedbackFormComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.IFeedbackFormCParams;
    public $params: Params.IFeedbackFormCParams;
    public config = Params.feedbackConfig;
    public contactsConfig: IContactsConfig;
    public formData$: BehaviorSubject<IIndexing<any>> = new BehaviorSubject(null);
    public submitButtonPending$: BehaviorSubject<boolean>;
    protected userProfile$: BehaviorSubject<UserProfile>;
    protected form: FormGroup;

    constructor(
        @Inject('injectParams') protected params: Params.IFeedbackFormCParams,
        protected contactsService: ContactsService,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.contactsConfig = this.configService.get<IContactsConfig>('$base.contacts');

        if (this.configService.get<boolean>('$base.forms.useSubmitButtonPending')) {
            this.submitButtonPending$ = new BehaviorSubject(false);
        }
    }

    public ngAfterViewInit(): void {
        this.userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');

        this.userProfile$
            .pipe(
                skipWhile(v => !v),
                takeUntil(this.$destroy),
            )
            .subscribe((userProfile) => {
                this.setUser(userProfile);
            });
    }

    public async ngSubmit(form: FormGroup): Promise<boolean> {
        const {senderEmail, senderName, message, subject} = form.getRawValue();

        try {
            await this.contactsService.send({
                senderName,
                senderEmail,
                subject,
                message,
            });

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Form submitted successfully'),
                    message: gettext('Your message has been successfully sent'),
                    wlcElement: 'notification_feedback-send-success',
                },
            });

            this.form.reset();

            if (this.configService.get<BehaviorSubject<UserProfile>>('$user.isAuthenticated')) {
                this.setUser(this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue());
            }

            return true;

        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Form submitting error'),
                    message: gettext('Check the correctness of filling in the data'),
                    wlcElement: 'notification_feedback-send-error',
                },
            });

            return false;
        }
    }

    public getForm(form: FormGroup): void {
        this.form = form;
    }

    protected setUser(userProfile: UserProfile): void {
        const {email, firstName, lastName} = userProfile;
        const name = (firstName.length && lastName.length) ? `${firstName} ${lastName}` : '';

        this.formData$.next({
            senderEmail: email,
            senderName: name,
        });
    }
}
