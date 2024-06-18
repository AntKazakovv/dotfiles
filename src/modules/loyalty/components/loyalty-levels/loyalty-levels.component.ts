import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    first,
    tap,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
    ITableCol,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty/system/services/loyalty-levels/loyalty-levels.service';

import * as Params from './loyalty-levels.params';

@Component({
    selector: '[wlc-loyalty-levels]',
    templateUrl: './loyalty-levels.component.html',
    styleUrls: ['./styles/loyalty-levels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyLevelsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyLevelTableCParams;

    public override $params: Params.ILoyaltyLevelTableCParams;
    public readonly levels$: BehaviorSubject<LoyaltyLevelModel[] | null> = new BehaviorSubject(null);
    public tableData!: ITableCParams;

    protected readonly loyaltyLevelsService: LoyaltyLevelsService = inject(LoyaltyLevelsService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyLevelTableCParams,
    ) {
        super(
            <IMixedParams<Params.ILoyaltyLevelTableCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.tableData = {
            ...this.$params.tableConfig,
            head: this.$params.excludedHeadKeys?.length
                ? Params.loyaltyTableHeadConfig.filter(
                    (tableHead: ITableCol) => !this.$params.excludedHeadKeys.includes(tableHead.key))
                : Params.loyaltyTableHeadConfig,
            rows: this.levels$,
        };

        this.loyaltyLevelsService.getLoyaltyLevelsObserver().pipe(
            first(v => !!v),
            tap((levels: LoyaltyLevelModel[]) => this.levels$.next(levels)),
            takeUntil(this.$destroy),
        ).subscribe();
    }
}
