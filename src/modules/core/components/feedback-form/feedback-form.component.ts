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
    public phone: string;
    public email: string;
    public formData$: BehaviorSubject<IIndexing<any>> = new BehaviorSubject(null);
    protected userProfile$: BehaviorSubject<UserProfile>;

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

        this.phone = this.configService.get<string>('$base.contacts.phone');
        this.email = this.configService.get<string>('$base.contacts.email');
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

    public ngSubmit(form: FormGroup): void {
        const {senderEmail, senderName, message, subject} = form.value;

        this.contactsService.send({
            senderName,
            senderEmail,
            subject,
            message,
        })
            .then(() => {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                        title: gettext('Form submitted successfully'),
                        message: gettext('Your message has been successfully sent'),
                        wlcElement: 'notifiсation_feedback-send-success',
                    },
                });

                if (this.configService.get<BehaviorSubject<UserProfile>>('$user.isAuthenticated')) {
                    this.setUser(this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue());
                } else {
                    this.formData$.next({});
                }

            })
            .catch(() => {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Form submitting error'),
                        message: gettext('Check the correctness of filling in the data'),
                        wlcElement: 'notifiсation_feedback-send-error',
                    },
                });
            });
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
