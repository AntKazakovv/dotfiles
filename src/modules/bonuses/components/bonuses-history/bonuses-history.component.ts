import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
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
    HistoryFilterService,
    TBonusFilter,
    IFilterValue,
} from 'wlc-engine/modules/core';
import {bonusesConfig} from 'wlc-engine/modules/core/system/config/history.config';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {HistoryItemModel} from 'wlc-engine/modules/bonuses/system/models/bonus-history-item/bonus-history-item.model';

import * as Params from './bonuses-history.params';

@Component({
    selector: '[wlc-bonuses-history]',
    templateUrl: './bonuses-history.component.html',
    styleUrls: ['./styles/bonuses-history.component.scss'],
})
export class BonusesHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public $params: Params.IBonusesHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams<TBonusFilter> = bonusesConfig.filterSelect;
    protected filterValue: TBonusFilter = 'all';
    protected bonuses$: BehaviorSubject<HistoryItemModel[]> = new BehaviorSubject([]);
    protected allBonuses: HistoryItemModel[] = [];
    protected historyFilterService: HistoryFilterService;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected actionService: ActionService,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.IBonusesHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.bonusesService.queryBonuses(true, 'history');
        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;
        this.historyFilterService
            = await this.injectionService.getService<HistoryFilterService>('finances.history-filter');
        this.setSubscription();

        this.historyFilterService.setDefaultFilter('bonus', {
            filterValue: this.filterValue,
        });
        this.historyFilterService.setFilter('bonus', {
            filterValue: this.filterValue,
        });
        this.tableData = {
            noItemsText: gettext('No bonuses history'),
            head: Params.bonusHistoryTableHeadConfig,
            rows: this.bonuses$,
            switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
        };

        this.bonuses$.next(this.bonusesFilter());

        this.ready = true;
        this.cdr.markForCheck();
    }

    protected bonusesFilter(): HistoryItemModel[] {
        let result: HistoryItemModel[] = this.allBonuses || [];

        if (this.filterValue !== 'all') {
            result = _filter(result, (item: HistoryItemModel): boolean => {
                return item.Status === this.filterValue;
            });
        }

        return _orderBy(result, (item: HistoryItemModel): number => DateTime.fromSQL(item.End).toSeconds(), 'desc');
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('bonus')
            .pipe(
                takeUntil(this.$destroy),
                filter((data: IFilterValue<TBonusFilter>): boolean => !!data && this.filterValue != data.filterValue),
            )
            .subscribe((data: IFilterValue<TBonusFilter>): void => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.bonuses$.next(this.bonusesFilter());
            });

        this.bonusesService.getObserver<HistoryItemModel>('history')
            .pipe(takeUntil(this.$destroy))
            .subscribe((bonuses: HistoryItemModel[]): void => {
                this.allBonuses = bonuses;
            });

        this.filterSelect.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                filter((filterValue: TBonusFilter): boolean => this.filterValue != filterValue),
            )
            .subscribe((filterValue: TBonusFilter): void => {
                this.historyFilterService.setFilter('bonus', {
                    filterValue: this.filterValue = filterValue,
                });
                this.bonuses$.next(this.bonusesFilter());
            });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });
    }
}
