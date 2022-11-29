import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    BehaviorSubject,
    first,
    firstValueFrom,
} from 'rxjs';

import {
    ConfigService,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {
    IPepConfirmPasswordFormCParams,
} from 'wlc-engine/modules/user/submodules/pep/components/pep-confirm-password-form/pep-confirm-password-form.params';
import {
    PepAbstractModalComponent,
} from 'wlc-engine/modules/user/submodules/pep/system/classes/pep-abstract-modal/pep-abstract-modal.component';
import {
    PepEventKind,
    PepModalId,
    PepService,
} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.service';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';

import {
    defaultParams,
    IPepInfoCParams,
} from './pep-info.params';

@Component({
    selector: '[wlc-pep-info]',
    templateUrl: './pep-info.component.html',
    styleUrls: ['./styles/pep-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PepInfoComponent extends PepAbstractModalComponent implements OnInit {
    @Input() public inlineParams!: IPepInfoCParams;

    public $params!: IPepInfoCParams;

    protected readonly modalId: PepModalId = 'pepInfo';
    protected readonly cancellingEvent: PepEventKind = 'PEP_STATUS_CANCEL';
    protected isMetamask: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: IPepInfoCParams,
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected pepService: PepService,
        protected configService: ConfigService,
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

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.isMetamask = await this.isAuthWithMetamask();
    }

    public async ngSubmit(): Promise<void> {
        this.unsubscribeFromCancelingOnClosePage();

        if (this.isMetamask) {
            await this.confirmWithMetamask();
        } else {
            await this.confirmWithPassword();
        }
    };

    protected async confirmWithPassword(): Promise<void> {
        await this.modalService.showModal<IPepConfirmPasswordFormCParams>('pepConfirmation', {
            pep: this.$params.pep,
        });
    }

    protected async confirmWithMetamask(): Promise<void> {
        const {pep} = this.$params;

        await this.pepService.confirmStatusWithMetamask(pep);
        this.modalService.closeAllModals();
        await this.modalService.showModal('pepSaved', {pep});
    }

    protected async isAuthWithMetamask(): Promise<boolean> {
        const userProfile: UserProfile = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
                .pipe(first(v => !!v?.idUser)),
        );

        return userProfile.type === 'metamask';
    }
}
