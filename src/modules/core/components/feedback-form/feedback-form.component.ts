import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ContactsService} from 'wlc-engine/modules/core/system/services/contacts/contacts.service';
import {ConfigService, ModalService} from 'wlc-engine/modules/core/system/services';
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
        protected modalService: ModalService,
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
                // TODO: replace with notification
                this.modalService.showModal({
                    id: 'feedback-form-successful-dispatch',
                    modifier: 'info',
                    modalTitle: gettext('Form submission successfully'),
                    modalMessage: gettext('Your message has been successfully sent'),
                    size: 'sm',
                });
            })
            .catch((error) => {
                console.error('Form submission error: ', error);

                this.modalService.showError({
                    modalTitle: gettext('Form submission error'),
                    modalMessage: [
                        gettext('Check the correctness of filling in the data'),
                    ],
                });
            });
    }
}
