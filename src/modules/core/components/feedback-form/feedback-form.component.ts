import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

import {BehaviorSubject} from 'rxjs';
import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';
import _isEmpty from 'lodash-es/isEmpty';
import _clone from 'lodash-es/clone';
import _each from 'lodash-es/each';

import {
    AbstractComponent,
    ConfigService,
    ContactsService,
    EventService,
    IFormWrapperCParams,
    IIndexing,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {
    IContactsConfig,
    TContactsTranslate,
} from 'wlc-engine/modules/core/system/interfaces';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFormComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.IFeedbackFormCParams;

    public $params: Params.IFeedbackFormCParams;
    public config!: IFormWrapperCParams;
    public contactsConfig: IContactsConfig;
    public formData$: BehaviorSubject<IIndexing<any>> = new BehaviorSubject(null);

    protected userProfile$: BehaviorSubject<UserProfile>;

    constructor(
        @Inject('injectParams') protected params: Params.IFeedbackFormCParams,
        protected contactsService: ContactsService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected translateService: TranslateService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.contactsConfig = _clone(this.configService.get<IContactsConfig>('$base.contacts'));
        this.modifyConfigByLanguage();
        this.setConfig();
        this.contactsConfig = this.configService.get<IContactsConfig>('$base.contacts');
    }

    public ngAfterViewInit(): void {
        this.userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');

        this.userProfile$
            .pipe(
                skipWhile(v => !v),
                takeUntil(this.$destroy),
            )
            .subscribe((userProfile) => {
                this.setConfig();
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

            form.reset();

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

    protected setConfig(): void {
        this.config = Params.getFeedbackConfig(this.configService.get<boolean>('$user.isAuthenticated'));
        this.cdr.markForCheck();
    }

    protected setUser(userProfile: UserProfile): void {
        const {email, firstName, lastName} = userProfile;
        const name = (firstName.length && lastName.length) ? `${firstName} ${lastName}` : '';

        this.formData$.next({
            senderEmail: email,
            senderName: name,
        });
    }

    protected modifyConfigByLanguage(): void {
        if (_isEmpty(this.contactsConfig.translate)) {
            return;
        }
        const lang = this.translateService.currentLang;
        _each(this.contactsConfig.translate,
            (value: TContactsTranslate[keyof TContactsTranslate], key: string): void => {
                this.contactsConfig[key] = value[lang] || this.contactsConfig[key];
            });
    }
}
