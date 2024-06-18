import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    HostListener,
    inject,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';

import {
    AbstractComponent,
    ModalService,
} from 'wlc-engine/modules/core';
import {InternalMailsService} from 'wlc-engine/modules/internal-mails/system/services';

import * as Params from './mail-actions-dropdown.params';

@Component({
    selector: '[wlc-mail-actions-dropdown]',
    templateUrl: './mail-actions-dropdown.component.html',
    styleUrls: ['./styles/mail-actions-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailActionsDropdownComponent extends AbstractComponent implements OnInit {

    @ViewChild('dropdownContainer') protected dropdownContainer!: ElementRef;
    protected readonly internalMailsService: InternalMailsService = inject(InternalMailsService);
    public override $params: Params.IMailActionsDropdownCParams;
    public isOpened: boolean = false;

    public constructor(
        @Inject('injectParams') params: Params.IMailActionsDropdownCParams,
        protected readonly modalService: ModalService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public toggleDropDownHandle(): void {
        this.isOpened = !this.isOpened;
    }

    @HostListener('document:mousedown', ['$event'])
    protected outsideClick(event: MouseEvent): void {
        event.preventDefault();
        if (this.isOpened
            && !this.dropdownContainer.nativeElement.contains(event.target)
        ) {
            this.isOpened = !this.isOpened;
            this.cdr.markForCheck();
        }
    }

    public deleteMessageHandle(): void {
        this.modalService.showModal({
            id: 'internal-mail-delete',
            modalTitle: gettext('Confirmation'),
            modalMessage: gettext('Are you sure?'),
            showConfirmBtn: true,
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('No'),
                },
            },
            confirmBtnText: gettext('Yes'),
            onConfirm: () => {
                this.internalMailsService.deleteMail(this.$params.internalMail);
            },
        });
    }
}
