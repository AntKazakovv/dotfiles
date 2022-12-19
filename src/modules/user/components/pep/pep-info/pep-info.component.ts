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

import {ConfigService} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user/system/models';
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
        protected userService: UserService,
        protected configService: ConfigService,
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
