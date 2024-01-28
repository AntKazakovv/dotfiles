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
import _cloneDeep from 'lodash-es/cloneDeep';
import _find from 'lodash-es/find';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    IDatepickerCParams,
    ConfigService,
    ActionService,
    IIndexing,
    DeviceType,
} from 'wlc-engine/modules/core';
import {IHistoryFilter} from 'wlc-engine/modules/history/system/interfaces/history-filter.interface';
import {
    startDate,
    endDate,
} from 'wlc-engine/modules/history/system/config/history.config';
import {HistoryFilterService} from 'wlc-engine/modules/history/system/services/history-filter.service';

import * as Params from './cashback-history.params';

import {
    ICashbackHistory,
} from 'wlc-engine/modules/history/system/interfaces/cashback-history/cashback-history.interface';
import {CashbackService} from 'wlc-engine/modules/history/system/services/cashback.service';

@Component({
    selector: '[wlc-cashback-history]',
    templateUrl: './cashback-history.component.html',
    styleUrls: ['./styles/cashback-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashbackHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public awaiting: boolean = false;
    public showFilter: boolean = false;
    public override $params: Params.ICashbackHistoryCParams;
    public tableData: ITableCParams;
    public startDateInput: IDatepickerCParams = _cloneDeep(startDate);
    public endDateInput: IDatepickerCParams = _cloneDeep(endDate);
    public cashbacks$: BehaviorSubject<ICashbackHistory[]> = new BehaviorSubject([]);

    protected startDate: DateTime = DateTime.local().minus({month: 1});
    protected endDate: DateTime = DateTime.local().endOf('day');
    protected readonly today: DateTime = DateTime.local().endOf('day');
    protected allCashbacks: ICashbackHistory[] = [];
    protected isFirstRequest: boolean = true;

    constructor(
        @Inject('injectParams') protected params: Params.ICashbackHistoryCParams,
        cdr: ChangeDetectorRef,
        protected cashbackService: CashbackService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        configService: ConfigService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.ICashbackHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        if (this.showFilter) {
            this.filterHandlers();
        }

        this.setMinMaxDate();

        this.historyFilterService.setAllFilters('cashback', {
            startDate: this.startDate,
            endDate: this.endDate,
        });

        this.prepareTableParams();
        this.setSubscription();
    }

    protected prepareTableParams(): void {
        this.tableData = this.$params.tableConfig;
        this.tableData.rows = this.cashbacks$;
        this.tableData.switchWidth ??= this.configService.get('$base.profile.type') === 'first'
            ? 1200
            : 1024;
    }

    protected setMinMaxDate(): void {
        const disableSince = this.endDate.toObject();
        const disableUntil = this.startDate.toObject();

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

    /**
     * Push cashbacks to table and show loader in process
     *
     * @param {boolean} needRequest - if date dont change we dont need a new request
     *
     * @returns {Promise<void>}
     */
    protected async pushNewCashbacksList(needRequest: boolean): Promise<void> {
        this.awaiting = true;
        this.cashbacks$.next(await this.getCashbacks(this.isFirstRequest || needRequest));

        if (this.isFirstRequest) {
            this.isFirstRequest = false;
        }
        this.awaiting = false;

        if (!this.ready) {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }

    /**
     * Get and filter cashbacks
     *
     * @param {boolean} needRequest - if date dont change we dont need a new request
     *
     * @returns {Promise<ICashbackHistory[]>}
     */
    protected async getCashbacks(needRequest: boolean): Promise<ICashbackHistory[]> {
        return await this.cashbackService.getCashbacks(
            {
                endDate: this.endDate,
                startDate: this.startDate,

            },
            needRequest,
        );
    }

    protected setSubscription(): void {
        this.eventService.subscribe([
            {name: 'CASHBACK_HISTORY'},
        ], async (): Promise<void> => {
            const cashbacks: ICashbackHistory[] = await this.getCashbacks(true);
            this.cashbacks$.next(cashbacks);
        }, this.$destroy);

        this.historyFilterService.getFilter('cashback')
            .pipe(
                filter((filter: IHistoryFilter) => !!filter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (data: IHistoryFilter): Promise<void> => {
                const changedData: IIndexing<boolean> = {
                    endDate: !this.endDate.equals(data.endDate),
                    startDate: !this.startDate.equals(data.startDate),
                };

                if (this.ready && !_find(changedData, (value: boolean): boolean => value)) {
                    return;
                }

                const dateChange: boolean = changedData.startDate || changedData.endDate;

                if (dateChange) {
                    this.startDateInput.control.setValue(this.startDate = data.startDate);
                    this.endDateInput.control.setValue(this.endDate = data.endDate);
                    this.setMinMaxDate();
                }

                this.pushNewCashbacksList(dateChange);
            });

        this.filterHandlers();

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.markForCheck();
            });
    }

    protected filterHandlers(): void {

        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: DateTime): boolean => this.startDate.toMillis() !== startDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((startDate: DateTime): void => {
                this.historyFilterService.setFilter('cashback', {startDate});
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: DateTime): boolean => this.endDate.toMillis() !== endDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((endDate: DateTime): void => {
                this.historyFilterService.setFilter('cashback', {endDate});
            });
    }
}
