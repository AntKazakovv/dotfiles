import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
    inject,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IWrapperCParams,
    ModalService,
} from 'wlc-engine/modules/core';

import {StoreSubscribeController} from '../../system/controllers/store-subscribe.controller';
import {TournamentSubscribeController} from '../../system/controllers/tournament-subscribe.controller';
import {BonusSubscribeController} from '../../system/controllers/bonus-subscribe.controller';
import {LoyaltySubscribeBaseController} from '../../system/controllers/loyalty-subscribe-base.controller';
import {IAmount} from 'wlc-engine/modules/loyalty/system';

import * as Params from './loyalty-confirm.params';

@Component({
    selector: '[wlc-loyalty-confirm]',
    templateUrl: './loyalty-confirm.component.html',
    styleUrls: ['./styles/loyalty-confirm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        LoyaltySubscribeBaseController,
        StoreSubscribeController,
        TournamentSubscribeController,
        BonusSubscribeController,
    ],
})

export class LoyaltyConfirmComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyConfirmCParams;
    public override $params: Params.ILoyaltyConfirmCParams;
    public isMultiWallet: boolean;
    public walletsParams: IWrapperCParams;
    public subscribeButtonText: string = gettext('Subscribe');

    protected controller: LoyaltySubscribeBaseController = inject(LoyaltySubscribeBaseController);
    protected modalService: ModalService = inject(ModalService);
    protected eventService: EventService = inject(EventService);

    private _componentParams: IWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyConfirmCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.controller.init(this.$params.item, this.$destroy, this.$params.type);
        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

        if (this.isMultiWallet) {
            this.prepareWalletsParams();
        }

        this.subscribeButtonText = this.$params.buttonCaptions[this.$params.type];
    }

    public get componentParams(): any {
        return this._componentParams;
    }

    public get debitAmount(): IAmount[] {
        return this.controller.debitAmount;
    }

    public get creditAmount(): IAmount[] {
        return this.controller.creditAmount;
    }

    public get isTournament(): boolean {
        return this.$params.type === 'tournament';
    }

    public async subscribeHandler(): Promise<void> {
        await this.controller.subscribe();
        this.closeModal();
    }

    public closeModal(): void {
        return this.modalService.hideModal('loyalty-confirmation', 'loyalty-confirm', 'success');
    }

    protected prepareWalletsParams(): void {
        this.walletsParams = {
            components: [
                {
                    name: 'multi-wallet.wlc-wallets',
                    params: {
                        ...this.$params.walletsParams,
                        onWalletChange: this.controller.onWalletChange,
                    },
                },
            ],
        };
    }
}
