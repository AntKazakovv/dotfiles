import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
    takeWhile,
} from 'rxjs/operators';
import {DateTime} from 'luxon';
import _orderBy from 'lodash-es/orderBy';
import _filter from 'lodash-es/filter';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ISelectCParams,
    ConfigService,
    ActionService,
    DeviceType,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    IHistoryFilterValue,
    TBonusFilter,
    bonusesConfig,
    HistoryService,
    HistoryFilterService,
    BonusHistoryItemModel,
} from 'wlc-engine/modules/history';
import * as Params from './bonuses-history.params';

@Component({
    selector: '[wlc-bonuses-history]',
    templateUrl: './bonuses-history.component.html',
    styleUrls: ['./styles/bonuses-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusesHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public override $params: Params.IBonusesHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams<TBonusFilter> = bonusesConfig.filterSelect;
    public bonuses$: BehaviorSubject<BonusHistoryItemModel[]> = new BehaviorSubject([]);

    protected filterValue: TBonusFilter = 'all';
    protected allBonuses: BonusHistoryItemModel[] = [];
    protected historyFilterService: HistoryFilterService;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesHistoryCParams,
        cdr: ChangeDetectorRef,
        protected historyService: HistoryService,
        protected eventService: EventService,
        configService: ConfigService,
        protected actionService: ActionService,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.IBonusesHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.historyService.queryHistory(true, 'bonusesHistory');
        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;
        this.historyFilterService
            = await this.injectionService.getService<HistoryFilterService>('history.history-filter');

        if (this.showFilter) {
            this.filterHandlers();
        }
        this.setSubscription();

        this.historyFilterService.setAllFilters('bonus', {
            filterValue: this.filterValue,
        });

        this.bonuses$.next(this.bonusesFilter());

        this.prepareTableParams();

        this.ready = true;
        this.cdr.detectChanges();
    }

    protected prepareTableParams(): void {
        this.tableData = this.$params.tableConfig;
        this.tableData.rows = this.bonuses$;
        this.tableData.switchWidth ??= (this.configService.get('$base.profile.type') === 'first')
            ? 1200
            : 1024;
    }

    protected bonusesFilter(): BonusHistoryItemModel[] {
        let result: BonusHistoryItemModel[] = this.allBonuses || [];

        if (this.filterValue !== 'all') {
            result = _filter(result, (item: BonusHistoryItemModel): boolean => {
                return item.Status === this.filterValue;
            });
        }

        return _orderBy(
            result,
            (item: BonusHistoryItemModel): number => DateTime.fromSQL(item.End).toSeconds(),
            'desc',
        );
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('bonus')
            .pipe(
                filter(
                    (data: IHistoryFilterValue<TBonusFilter>): boolean => {
                        return !!data && this.filterValue !== data.filterValue;
                    },
                ),
                takeUntil(this.$destroy),
            )
            .subscribe((data: IHistoryFilterValue<TBonusFilter>): void => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.bonuses$.next(this.bonusesFilter());
                this.cdr.detectChanges();
            });

        this.historyService.getObserver<BonusHistoryItemModel>('bonusesHistory')
            .pipe(takeUntil(this.$destroy))
            .subscribe((bonuses: BonusHistoryItemModel[]): void => {
                this.allBonuses = bonuses;
                this.cdr.detectChanges();
            });

        this.filterHandlers();

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });
    }

    protected filterHandlers(): void {
        this.filterSelect.control.valueChanges
            .pipe(
                filter((filterValue: TBonusFilter): boolean => this.filterValue !== filterValue),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((filterValue: TBonusFilter): void => {
                this.historyFilterService.setFilter('bonus', {
                    filterValue: this.filterValue = filterValue,
                });
                this.bonuses$.next(this.bonusesFilter());
                this.cdr.detectChanges();
            });
    }
}
