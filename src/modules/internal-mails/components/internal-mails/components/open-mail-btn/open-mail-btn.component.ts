import {
    Component,
    OnInit,
    Inject,
    HostBinding,
    ViewChild,
    TemplateRef,
    ElementRef,
    ChangeDetectionStrategy,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';

import * as Params from './open-mail-btn.params';

@Component({
    selector: '[wlc-open-mail-btn]',
    templateUrl: './open-mail-btn.component.html',
    styleUrls: ['./styles/open-mail-btn.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenMailBtnComponent extends AbstractComponent implements OnInit {
    @HostBinding('class.profile-first') protected profileFirst: boolean;
    /**
     * A template to send to a modal as a message from an mail
     */
    @ViewChild('message') protected message: TemplateRef<ElementRef>;
    public $params: Params.IOpenMailMessageBtn;

    constructor(
        @Inject('injectParams') protected params: Params.IOpenMailMessageBtn,
        protected modalService: ModalService,
        protected configService: ConfigService,
        protected internalMailsService: InternalMailsService,
    ) {
        super(
            <IMixedParams<Params.IOpenMailMessageBtn>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.profileFirst = this.configService.get('$base.profile.type') === 'first';
    }

    /**
     * Show mail in modal and mark as read
     *
     * @returns {void}
     */
    public openMessage(): void {
        this.modalService.showModal({
            id: 'internal-mail',
            modalTitle: this.$params.internalMail.title,
            templateRef: this.message,
            closeBtnText: gettext('Close'),
            showConfirmBtn: true,
            confirmBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('Delete'),
                },
            },
            onConfirm: () => {
                this.internalMailsService.deleteMail(this.$params.internalMail);
            },
        });

        if (this.$params.internalMail.status !== 'readed') {
            this.internalMailsService.markAsRead(this.$params.internalMail);
        }
    }
}
