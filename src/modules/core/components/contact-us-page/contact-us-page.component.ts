import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {
    ConfigService,
    ContactsService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {FeedbackFormComponent} from 'wlc-engine/modules/core/components/feedback-form/feedback-form.component';

import * as Params from './contact-us-page.params';

/**
 * Feedback form component. The senderEmail, senderName, message, subject fields are required.
 *
 * @example
 *
 * {
 *     name: 'core.wlc-contact-us-page',
 * }
 *
 */
@Component({
    selector: '[wlc-contact-us-page]',
    templateUrl: './contact-us-page.component.html',
    styleUrls: ['./styles/contact-us-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUsPageComponent extends FeedbackFormComponent {

    public override $params: Params.IContactUsPageCParams;

    constructor(
        contactsService: ContactsService,
        configService: ConfigService,
        eventService: EventService,
        translateService: TranslateService,
        cdr: ChangeDetectorRef,
    ) {
        super(Params.defaultParams, contactsService, configService, eventService, translateService, cdr);
    }
}
