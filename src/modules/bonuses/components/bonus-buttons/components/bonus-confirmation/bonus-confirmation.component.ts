import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {BonusCancellationInfo} from 'wlc-engine/modules/bonuses/system/models';
import {
    BonusesService,
} from 'wlc-engine/modules/bonuses';

import * as Params from './bonus-confirmation.params';

@Component({
    selector: '[wlc-bonus-confirmation]',
    templateUrl: './bonus-confirmation.component.html',
    styleUrls: ['./styles/bonus-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BonusConfirmationComponent extends AbstractComponent implements OnInit {
    /**
     * Loyalty bonus id
     * @protected string
     */
    @Input() protected loyaltyBonusId: string;
    @Input() protected bonusId: number;
    @Input() protected confirmationAction: Params.IConfirmationAction = 'cancel';

    public override $params: Params.IBonusConfirmationParams;
    public bonusInfo: BonusCancellationInfo;
    public errors: string[];
    public isReady: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusConfirmationParams,
        protected bonusesService: BonusesService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IBonusConfirmationParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        if (this.confirmationAction === 'cancel') {
            try {
                this.bonusInfo =
                    await this.bonusesService.getCancelInformation(this.loyaltyBonusId, this.bonusId);
            } catch (errors) {
                this.errors = errors;
            }
        }

        this.isReady = true;
        this.cdr.markForCheck();
    }
}
