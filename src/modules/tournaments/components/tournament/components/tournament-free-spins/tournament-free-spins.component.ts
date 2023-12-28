import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import _toNumber from 'lodash-es/toNumber';

import {
    AbstractComponent,
    ConfigService,
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';

import {TournamentsService} from 'wlc-engine/modules/tournaments';
import * as Params from './tournament-free-spins.params';

@Component({
    selector: '[wlc-tournament-free-spins]',
    templateUrl: './tournament-free-spins.component.html',
    styleUrls: ['./styles/tournament-free-spins.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TournamentFreeSpinsComponent extends AbstractComponent implements OnInit {
    @ViewChild('freeSpinsModal')
    public tplModal: TemplateRef<ElementRef>;
    @Input() public inlineParams: Params.ITournamenFreeSpinsParams;
    public override $params: Params.ITournamenFreeSpinsParams;
    public usedPackages: any[];
    public availablePackages: any[];
    public userService: UserService;
    private isMultiWallet: boolean;

    constructor(
        @Inject('injectParams')
        protected injectParams: Params.ITournamenFreeSpinsParams,
        protected override configService: ConfigService,
        private tournamentsService: TournamentsService,
        private injectionService: InjectionService,
        private modalService: ModalService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.usedPackages = new Array(_toNumber(this.$params.freeSpins.Used));
        this.availablePackages = new Array(_toNumber(this.availablePackagesCount));
        this.userService = await this.injectionService.getService<UserService>('user.user-service');
        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
    }

    public buy(): void {
        this.modalService.showModal({
            id: 'free-spins-buy',
            modalTitle: gettext('Confirmation'),
            modifier: 'confirmation',
            showConfirmBtn: true,
            confirmBtnText: gettext('Buy now'),
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('Cancel'),
                },
            },
            templateRef: this.tplModal,
            textAlign: 'center',
            onConfirm: async () => {
                this.tournamentsService.buyFreeRoundsPackage(this.$params.tournamentId, this.$params.buyParams);
                this.modalService.hideModal('free-spins-buy');
            },
            dismissAll: true,
        });
    }

    public get availablePackagesCount(): number {
        return this.$params.freeSpins.Packages - this.$params.freeSpins.Used;
    }

    public get buyPrice(): number {
        return _toNumber(this.isMultiWallet
            ? this.$params.freeSpins.Price[this.userService.userProfile.currency]
            : this.$params.freeSpins.Price.Currency);
    }
}
