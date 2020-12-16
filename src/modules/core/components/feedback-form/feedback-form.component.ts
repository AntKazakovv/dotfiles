import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
    ContactsService,
    AbstractComponent,
} from 'wlc-engine/modules/core';
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

    constructor(
        @Inject('injectParams') protected params: Params.IFeedbackFormCParams,
        protected contactsService: ContactsService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public ngSubmit(form: FormGroup): void {
        const {senderEmail, senderName, message, subject} = form.value;

        this.contactsService.send({
            senderName,
            senderEmail,
            subject,
            message,
        });
    }
}
