import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './lotteries-history.params';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {RequestParamsType} from 'wlc-engine/modules/core/system/services/data/data.service';
import {BaseLottery} from 'wlc-engine/modules/lotteries/system/models/base-lottery.model';

@Component({
    selector: '[wlc-lotteries-history]',
    templateUrl: './lotteries-history.component.html',
    styleUrls: ['./styles/lotteries-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteriesHistoryComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILotteriesHistoryCParams;
    @Output() public historyLoaded: EventEmitter<boolean> = new EventEmitter();

    public override $params: Params.ILotteriesHistoryCParams;
    public history: BaseLottery[] = [];
    public isHistoryLoaded: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteriesHistoryCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected lotteriesService: LotteriesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        const queryParams: RequestParamsType = {
            limit: this.$params.limit || 10,
        };

        try {
            this.history = await this.lotteriesService.fetchLotteriesHistory(queryParams);
        } catch {

        } finally {
            this.isHistoryLoaded = true;
            this.historyLoaded.emit(!!this.history?.length || false);
        }
    }
}
