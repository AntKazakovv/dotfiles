import {
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IPepConfirmPasswordFormCParams} from '../pep-confirm-password-form/pep-confirm-password-form.params';
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
    IPepInfoCParams,
} from './pep-info.params';

@Component({
    selector: '[wlc-pep-info]',
    templateUrl: './pep-info.component.html',
    styleUrls: ['./styles/pep-info.component.scss'],
})
export class PepInfoComponent extends PepAbstractModalComponent implements OnInit {
    @Input() public inlineParams!: IPepInfoCParams;

    public $params!: IPepInfoCParams;

    protected readonly modalId: PepModalId = 'pepInfo';
    protected readonly cancellingEvent: PepEventKind = 'PEP_STATUS_CANCEL';

    constructor(
        @Inject('injectParams') protected injectParams: IPepInfoCParams,
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
    }

    public async ngSubmit(): Promise<void> {
        this.unsubscribeFromCancelingOnClosePage();

        await this.modalService.showModal<IPepConfirmPasswordFormCParams>('pepConfirmation', {
            pep: this.$params.pep,
        });
    };
}
