import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ContactsService} from 'wlc-engine/modules/core/system/services/contacts/contacts.service';
import {ConfigService, EventService} from 'wlc-engine/modules/core/system/services';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';
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
export class FeedbackFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IFeedbackFormCParams;
    public $params: Params.IFeedbackFormCParams;
    public config = Params.feedbackConfig;
    public phone: string;
    public email: string;

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
                    },
                });

            })
            .catch((error) => {
                console.error('Form submission error: ', error);

                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Form submitting error'),
                        message: gettext('Check the correctness of filling in the data'),
                    },
                });
            });
    }
}
