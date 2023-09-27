import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IModalConfig,
    ModalService,
} from 'wlc-engine/modules/core';

import * as Params from './fast-deposit.params';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models';

@Component({
    selector: '[wlc-fast-deposit]',
    templateUrl: './fast-deposit.component.html',
    styleUrls: ['./styles/fast-deposit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FastDepositComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IFastDepositCParams;

    public override $params: Params.IFastDepositCParams;
    public lastSucseedMethod: number | null;
    public paymentSystem: PaymentSystem;
    public depositUrl: string;

    protected paymentSystems: PaymentSystem[];
    protected isFetchingSystems: boolean = true;
    protected modalConfig: IModalConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFastDepositCParams,
        protected override configService: ConfigService,
        protected financesService: FinancesService,
        protected modalService: ModalService,
        protected override cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.setDepositUrl();
        this.setPaymentSystem();
    }

    protected setDepositUrl(): void {
        const lang: string = this.configService.get<string>('currentLanguage') || 'en';
        this.depositUrl = `/${lang}/profile/cash`;
    };

    protected async setPaymentSystem(): Promise<void> {
        const lastSucceedId: number = await this.financesService.getLastSucceedPaymentMethod(true);

        if (lastSucceedId) {

            if (!this.financesService.paymentSystems.length) {
                this.isFetchingSystems = true;
                try {
                    await this.financesService.fetchPaymentSystems();
                } catch {
                    this.isFetchingSystems = false;
                }
            }
            this.paymentSystem = this.financesService.getSystemById(lastSucceedId);
            this.isFetchingSystems = false;
        } else {
            this.isFetchingSystems = false;
        }
        this.cdr.markForCheck();
    }
}
