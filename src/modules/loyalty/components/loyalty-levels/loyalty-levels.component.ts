import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import _filter from 'lodash-es/filter';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty/system/services';

import * as Params from './loyalty-levels.params';

@Component({
    selector: '[wlc-loyalty-levels]',
    templateUrl: './loyalty-levels.component.html',
    styleUrls: ['./styles/loyalty-levels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyLevelsComponent extends AbstractComponent implements OnInit {
    public ready: boolean = false;
    public override $params: Params.ILoyaltyLevelTableCParams;
    public levels: BehaviorSubject<LoyaltyLevelModel[]> = new BehaviorSubject([]);
    public tableData: ITableCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyLevelTableCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected loyaltyLevelsService: LoyaltyLevelsService,
    )
    {
        super(
            <IMixedParams<Params.ILoyaltyLevelTableCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.levels.next(await this.loyaltyLevelsService.getLoyaltyLevelsSafely());
        this.tableData = {
            ...this.$params.tableConfig,
            head: this.$params.excludedHeadKeys.length
                ? _filter(
                    Params.loyaltyTableHeadConfig,
                    (tableHead) => !this.$params.excludedHeadKeys.includes(tableHead.key))
                : Params.loyaltyTableHeadConfig,
            rows: this.levels,
        };
        this.ready = true;
        this.cdr.detectChanges();
    }
}
