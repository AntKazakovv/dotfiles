import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
    inject,
    DestroyRef,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeWhile,
} from 'rxjs/operators';
import {DateTime, ToObjectOutput} from 'luxon';
import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    IDatepickerCParams,
    ConfigService,
    ActionService,
    DeviceType,
    IIndexing,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

import {
    IProfileNoContentCParams,
} from 'wlc-engine/modules/profile/components/profile-no-content/profile-no-content.params';

import {
    startDate,
    endDate,
    IHistoryFilter,
    OrderHistoryItemModel,
    HistoryService,
    HistoryFilterService,
} from 'wlc-engine/modules/history';

import * as Params from './orders-history.params';

@Component({
    selector: '[wlc-orders-history]',
    templateUrl: './orders-history.component.html',
    styleUrls: ['./styles/orders-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersHistoryComponent extends AbstractComponent implements OnInit {
    public isReady: boolean = false;
    public showFilter: boolean = false;
    public tableData: ITableCParams;
    public startDateInput: IDatepickerCParams = startDate;
    public endDateInput: IDatepickerCParams = endDate;
    public orders$: BehaviorSubject<OrderHistoryItemModel[]> = new BehaviorSubject([]);
    public override $params: Params.IOrdersHistoryCParams;

    protected allOrders: OrderHistoryItemModel[] = [];
    protected endDate: DateTime = DateTime.local();
    protected startDate: DateTime = this.endDate.minus({month: 1}).startOf('day');
    protected destroyRef = inject(DestroyRef);
    protected readonly historyService: HistoryService = inject(HistoryService);
    protected readonly actionService: ActionService = inject(ActionService);
    protected readonly historyFilterService: HistoryFilterService = inject(HistoryFilterService);
    protected readonly eventService: EventService = inject(EventService);

    constructor(
        @Inject('injectParams') protected params: Params.IOrdersHistoryCParams,
        protected override cdr: ChangeDetectorRef,
        protected override configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IOrdersHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.allOrders = await this.historyService.getOrdersList();

        if (this.allOrders.length) {
            this.endDate = DateTime.now();
            this.startDate = this.endDate.minus({month: 1});
        }

        this.setMinMaxDate();
        this.setSubscription();

        this.historyFilterService.setAllFilters('orders', {
            startDate: this.startDate,
            endDate: this.endDate,
        });

        this.filterOrdersByDate();
        this.prepareTableParams();
        this.adjustInnerComponents();

        this.isReady = true;
        this.cdr.markForCheck();
    }

    public get historyRangeParams(): Params.IOrdersHistoryRangeParams {
        return this.$params.historyRangeParams;
    }

    public get emptyConfigParams(): IWrapperCParams {
        return this.$params.emptyConfig;
    }

    protected adjustInnerComponents(): void {
        if (this.$params.theme !== 'default') {
            const noContentThemeParam: Partial<IProfileNoContentCParams> = {
                theme: `${this.$params.theme}`,
            };
            _merge(this.$params.emptyConfig.components[0].params, noContentThemeParam);
        }
    }

    protected setSubscription(): void {
        this.eventService.subscribe([
            {name: 'STORE_ITEM_BUY_SUCCEEDED'},
            {name: 'STORE_ITEM_BUY_FAILED'},
        ], async (): Promise<void> => {
            this.allOrders = await this.historyService.getOrdersList();
            this.filterOrdersByDate();
        });

        this.onMobileFilterDateChange();
        this.onDesktopFilterDateChange();

        this.actionService.deviceType()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.markForCheck();
            });
    }

    protected filterOrdersByDate(): void {
        this.orders$.next(this.allOrders.filter(
            order => DateTime.fromSQL(order.addDateSQL) >= this.startDate.startOf('day')
                && DateTime.fromSQL(order.addDateSQL) <= this.endDate.endOf('day')));

        this.cdr.markForCheck();
    }

    protected onDesktopFilterDateChange(): void {
        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: DateTime): boolean => this.startDate.toMillis() !== startDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((startDate: DateTime): void => {
                this.historyFilterService.setFilter('orders', {startDate});
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: DateTime): boolean => this.endDate.toMillis() !== endDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((endDate: DateTime): void => {
                this.historyFilterService.setFilter('orders', {endDate});
            });
    }

    protected onMobileFilterDateChange(): void {
        this.historyFilterService.getFilter('orders')
            .pipe(
                filter((filter: IHistoryFilter) => !!filter),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(async (data: IHistoryFilter): Promise<void> => {
                const {startDate, endDate} = data;
                const changedData: IIndexing<boolean> = {
                    startDate: !this.startDate.equals(startDate),
                    endDate: !this.endDate.equals(endDate),
                };

                if (this.isReady && !(Object.values(changedData).find((val) => !!val))
                ) {
                    return;
                }

                this.startDateInput.control.setValue(this.startDate = startDate);
                this.endDateInput.control.setValue(this.endDate = endDate);
                this.setMinMaxDate();
                this.filterOrdersByDate();
            });
    }

    private prepareTableParams(): void {
        this.tableData = this.$params.tableConfig;
        this.tableData.rows = this.orders$;
        this.tableData.themeMod = 'default';
    }

    private setMinMaxDate(): void {
        const disableSince: ToObjectOutput = this.endDate.toObject();
        const disableUntil: ToObjectOutput = this.startDate.toObject();

        this.startDateInput.control.setValue(this.startDate);
        this.endDateInput.control.setValue(this.endDate);

        if (this.startDateInput.datepickerOptions) {
            this.startDateInput.datepickerOptions.minDate = new Date(
                disableSince.year,
                disableSince.month - 1,
                disableSince.day,
            );

            this.startDateInput.datepickerOptions.maxDate = new Date(
                disableUntil.year,
                disableUntil.month - 1,
                disableUntil.day,
            );
        }
    }
}
