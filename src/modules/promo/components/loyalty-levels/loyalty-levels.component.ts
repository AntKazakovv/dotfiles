import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {
    AbstractComponent,
    IMixedParams,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelsService} from 'wlc-engine/modules/promo/system/services/loyalty-levels/loyalty-levels.service';
import {LoyaltyLevelModel} from 'wlc-engine/modules/promo/system/models/loyalty-level.model';

import * as Params from './loyalty-levels.params';

@Component({
    selector: '[wlc-loyalty-levels]',
    templateUrl: './loyalty-levels.component.html',
    styleUrls: ['./styles/loyalty-levels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyLevelsComponent extends AbstractComponent implements OnInit {
    public ready = false;
    public $params: Params.ILoyaltyLevelTableCParams;
    public levels: BehaviorSubject<LoyaltyLevelModel[]> = new BehaviorSubject([]);

    public tableData: ITableCParams = {
        pagination: {
            use: false,
            breakpoints: null,
        },
        noItemsText: gettext('An error occurred while loading data. Please try again later.'),
        head: Params.loyaltyTableHeadConfig,
        rows: this.levels,
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyLevelTableCParams,
        protected cdr: ChangeDetectorRef,
        protected loyaltyLevelsService: LoyaltyLevelsService,
    )
    {
        super(
            <IMixedParams<Params.ILoyaltyLevelTableCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.levels.next(await this.loyaltyLevelsService.getLoyaltyLevelsSafely());
        this.ready = true;
        this.cdr.detectChanges();
    }
}
