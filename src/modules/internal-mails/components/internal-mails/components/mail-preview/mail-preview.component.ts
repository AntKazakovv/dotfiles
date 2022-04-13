import {
    Component,
    ChangeDetectorRef,
    Inject,
    OnInit,
} from '@angular/core';
import {
    filter,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';

import * as Params from './mail-preview.params';

@Component({
    selector: '[wlc-mail-preview]',
    templateUrl: './mail-preview.component.html',
    styleUrls: ['./styles/mail-preview.component.scss'],
})
export class ProfileMessagePreviewComponent extends AbstractComponent implements OnInit {
    public $params: Params.IMailPreviewCParams;
    /**
     * Date of creation of the mail
     */
    public date: string;
    /**
     * The sender of the mail
     */
    public from: string;
    /**
     * read/unread mail icon path
     */
    public iconPath: string;

    constructor(
        @Inject('injectParams') protected params: Params.IMailPreviewCParams,
        protected internalMailsService: InternalMailsService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IMailPreviewCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.date = this.$params.internalMail.date;
        this.from = this.$params.internalMail.from;
        this.iconPath = this.$params.internalMail.status === 'new' ?
            '/wlc/icons/mails/unread-mail.svg':
            '/wlc/icons/mails/read-mail.svg';
        this.mailReadedSubscribe();
    }

    protected mailReadedSubscribe(): void {
        this.internalMailsService.readedMailID$
            .pipe(
                takeUntil(this.$destroy),
                filter((id: string): boolean => id === this.$params.internalMail.id),
            )
            .subscribe((): void => {
                this.iconPath = '/wlc/icons/mails/read-mail.svg';
                this.cdr.markForCheck();
            });
    }
}
