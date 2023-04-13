import {
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    PepEventKind,
    PepModalId,
    PepService,
} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.service';
import {
    PepAbstractModalComponent,
} from 'wlc-engine/modules/user/submodules/pep/system/classes/pep-abstract-modal/pep-abstract-modal.component';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';

import {
    defaultParams,
    IPepConfirmPasswordFormCParams,
} from './pep-confirm-password-form.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-pep-confirm-password-form]',
    templateUrl: './pep-confirm-password-form.component.html',
    styleUrls: ['./styles/pep-confirm-password-form.component.scss'],
})
export class PepConfirmPasswordFormComponent extends PepAbstractModalComponent implements OnInit {
    @Input() public inlineParams!: IPepConfirmPasswordFormCParams;

    public override $params!: IPepConfirmPasswordFormCParams;

    protected readonly modalId: PepModalId = 'pepConfirmation';
    protected readonly cancellingEvent: PepEventKind = 'PEP_STATUS_CANCEL';

    constructor(
        @Inject('injectParams') protected injectParams: IPepConfirmPasswordFormCParams,
        @Inject(WINDOW) window: Window,
        eventService: EventService,
        modalService: ModalService,
        pepService: PepService,
    ) {
        super(
            window,
            eventService,
            modalService,
            pepService,
            {
                injectParams,
                defaultParams,
            },
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.goBackOnHidden('pepInfo');
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const {password} = form.value;
        const {pep} = this.$params;

        try {
            await this.pepService.confirmStatus(pep, password);

            this.unsubscribeFromCancelingOnClosePage();

            this.modalService.closeAllModals();
            await this.modalService.showModal('pepSaved', {pep});
            return true;
        } catch (e) {
            this.pepService.fireEvent('PEP_ERROR_INCORRECT_PASSWORD');
            return false;
        }
    }
}
