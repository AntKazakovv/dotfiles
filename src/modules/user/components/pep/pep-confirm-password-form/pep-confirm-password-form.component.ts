import {
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {
    PepAbstractModalComponent,
} from 'wlc-engine/modules/user/components/pep/pep-abstract-modal/pep-abstract-modal.component';
import {
    PepEventKind,
    PepModalId,
    PepService,
} from 'wlc-engine/modules/user/system/services/pep/pep.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';

import {
    defaultParams,
    IPepConfirmPasswordFormCParams,
} from './pep-confirm-password-form.params';

@Component({
    selector: '[wlc-pep-confirm-password-form]',
    templateUrl: './pep-confirm-password-form.component.html',
    styleUrls: ['./styles/pep-confirm-password-form.component.scss'],
})
export class PepConfirmPasswordFormComponent extends PepAbstractModalComponent implements OnInit {
    @Input() public inlineParams!: IPepConfirmPasswordFormCParams;

    public $params!: IPepConfirmPasswordFormCParams;

    protected readonly modalId: PepModalId = 'pepConfirmation';
    protected readonly cancellingEvent: PepEventKind = 'PEP_STATUS_CANCEL';

    constructor(
        @Inject('injectParams') protected injectParams: IPepConfirmPasswordFormCParams,
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected pepService: PepService,
        protected userService: UserService,
    ) {
        super(
            window,
            eventService,
            modalService,
            pepService,
            userService,
            {
                injectParams,
                defaultParams,
            },
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.goBackOnHidden('pepInfo');
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {password} = form.value;
        const {pep} = this.$params;

        try {
            await this.pepService.confirmStatus(pep, password);

            this.unsubscribeFromCancelingOnClosePage();

            this.modalService.closeAllModals();
            await this.modalService.showModal('pepSaved', {pep});
        } catch (e) {
            this.pepService.fireEvent('PEP_ERROR_INCORRECT_PASSWORD');
        }
    }
}
