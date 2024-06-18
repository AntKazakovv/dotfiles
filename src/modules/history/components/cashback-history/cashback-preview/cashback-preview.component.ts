import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {EventService} from 'wlc-engine/modules/core';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {BetService} from 'wlc-engine/modules/history/system/services/bet.service';

import * as Params from './cashback-preview.params';

@Component({
    selector: '[wlc-cashback-preview]',
    templateUrl: './cashback-preview.component.html',
    styleUrls: ['./styles/cashback-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashbackPreviewComponent extends AbstractComponent implements OnInit {

    public override $params: Params.ICashbackPreviewParams;
    public date: string;
    public amount: string;

    constructor(
        @Inject('injectParams') protected params: Params.ICashbackPreviewParams,
        protected betService: BetService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.ICashbackPreviewParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.date = this.$params.cashback.AddDate;
        this.amount = this.$params.cashback.AmountConverted;
    }
}
