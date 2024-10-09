import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {BehaviorSubject} from 'rxjs';
import {
    filter,
    skip,
    takeUntil,
    takeWhile,
} from 'rxjs/operators';
import _cloneDeep from 'lodash-es/cloneDeep';
import _find from 'lodash-es/find';

import {
    ITableCParams,
    IMixedParams,
    AbstractComponent,
    ActionService,
    DeviceType,
    ISelectCParams,
    IDatepickerCParams,
} from 'wlc-engine/modules/core';
import {
    startDate,
    endDate,
    IHistoryFilter,
    HistoryFilterService,
    internalMailsConfig,
    TInternalMailFilter,
} from 'wlc-engine/modules/history';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';
import {
    IMessagesRequestParams,
    messagesFilterStatus,
} from 'wlc-engine/modules/internal-mails/system/interfaces';
import * as Params from './internal-mails.params';

@Component({
    selector: '[wlc-internal-mails]',
    templateUrl: './internal-mails.component.html',
    styleUrls: ['./styles/internal-mails.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalMailsComponent extends AbstractComponent implements OnInit {
    public ready: boolean = false;
    public readyMessages: boolean = false;
    public pending$: BehaviorSubject <boolean> = new BehaviorSubject(true);
    public override $params: Params.IInternalMailsCParams;
    public showFilter: boolean = false;
    public startDateInput: IDatepickerCParams = _cloneDeep(startDate);
    public endDateInput: IDatepickerCParams = _cloneDeep(endDate);
    public filterSelect: ISelectCParams<TInternalMailFilter> = _cloneDeep(internalMailsConfig.filterSelect);
    public tableData: ITableCParams = {};
    protected filterValue: TInternalMailFilter = 'all';
    protected endDate: Dayjs = dayjs().endOf('day');
    protected startDate: Dayjs | null = null;
    protected internalMails$: BehaviorSubject<InternalMailModel[]> = new BehaviorSubject([]);
    protected allMails: InternalMailModel[] = [];
    protected total: number;
    protected currentPage: number = 1;

    constructor(
        @Inject('injectParams') protected params: Params.IInternalMailsCParams,
        protected internalMailsService: InternalMailsService,
        protected historyFilterService: HistoryFilterService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.IInternalMailsCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;
        this.startDateInput.useEmptyValue = true;

        if (this.showFilter) {
            this.filterHandlers();
        }
        this.setSubscription();
        if (!this.showFilter) {
            await this.getMailsByPage(true);
        }
        this.ready = true;
        this.cdr.detectChanges();
    }

    public async changePage(event: any):Promise<void> {
        if (this.currentPage !== event.value) {
            this.currentPage = event.value;
            await this.getMailsByPage(false);
        }
    }

    protected setMinMaxDate(): void {

        this.endDateInput.control.setValue(this.endDate);
        if (this.startDateInput.datepickerOptions) {
            this.startDateInput.datepickerOptions.minDate = new Date(
                this.endDate.year(),
                this.endDate.month(),
                this.endDate.date(),
            );

            this.startDateInput.datepickerOptions.maxDate = new Date(
                this.startDate.year(),
                this.startDate.month(),
                this.startDate.date(),
            );
        }
    }

    protected prepareTableParams(page: number): void {
        this.tableData = {};
        this.tableData = this.$params.tableConfig;
        this.tableData.rows = this.internalMails$;
        this.tableData.switchWidth ??= (this.configService.get('$base.profile.type') === 'first')
            ? 1200
            : 1024;
        this.tableData.pageCount = 10;
        this.tableData.pagination.total = this.internalMailsService.totalMails;
        this.tableData.pagination.currentPage = page;
    }

    protected initFilters(): void {
        this.historyFilterService.setAllFilters('mails', {
            startDate: this.startDate,
            endDate: this.endDate,
            filterValue: this.filterValue,
        });
    }

    protected setSubscription(): void {
        this.internalMailsService.mails$
            .pipe(takeUntil(this.$destroy))
            .subscribe((mails: InternalMailModel[]): void => {
                this.allMails = mails;
                if (!this.ready) {
                    this.initFilters();
                } else {
                    this.internalMails$.next(this.allMails);
                    this.cdr.detectChanges();
                }
            });

        this.internalMailsService.readedMailID$
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((id: string): void => {
                const readedMail = _find(this.allMails, ['id', id]);
                if (readedMail) {
                    readedMail.readedStatus = true;
                    this.cdr.detectChanges();
                }
            });

        this.historyFilterService.getFilter('mails')
            .pipe(
                filter((data: IHistoryFilter): boolean => !!data),
                takeUntil(this.$destroy),
            )
            .subscribe(async (data: IHistoryFilter<TInternalMailFilter>): Promise<void> => {
                this.startDateInput.control.setValue(this.startDate = data.startDate);
                this.endDateInput.control.setValue(this.endDate = data.endDate);
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.setMinMaxDate();
                if (!this.showFilter) {
                    this.startDate = data.startDate;
                    this.endDate = data.endDate;
                    this.filterValue = data.filterValue;
                    this.getMailsByPage(true);
                }
            });

        this.filterHandlers();

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });

        this.internalMailsService.unreadMailsCount$
            .pipe(
                filter((value) => !!value),
                skip(1),
                takeUntil(this.$destroy),
            )
            .subscribe((): void => {
                this.getMailsByPage(true);
            });
    }

    protected filterHandlers(): void {
        const handleDateChange = (dateInput: IDatepickerCParams, dateType: 'startDate' | 'endDate'): void => {
            dateInput.control.valueChanges
                .pipe(
                    filter((newDate: Dayjs): boolean => this[dateType]
                        ? this[dateType].unix() !== newDate?.unix() : true),
                    takeWhile(() => this.showFilter),
                    takeUntil(this.$destroy),
                )
                .subscribe(async (newDate: Dayjs): Promise<void> => {
                    if (newDate?.valueOf()) {
                        this.historyFilterService.setFilter('mails', {[dateType]: this[dateType] = newDate});
                    }
                    await this.getMailsByPage(true);
                });
        };
        handleDateChange(this.startDateInput, 'startDate');
        handleDateChange(this.endDateInput, 'endDate');

        this.filterSelect.control.valueChanges
            .pipe(
                filter((value: TInternalMailFilter): boolean => this.filterValue !== value),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (value: TInternalMailFilter): Promise<void> => {
                this.historyFilterService.setFilter('mails', {
                    filterValue: this.filterValue = value,
                },
                );
                await this.getMailsByPage(true);
            });
    }

    private async getMailsByPage(resetPage: boolean): Promise<void>  {
        this.readyMessages = false;
        await this.internalMailsService.getTotalMails(this.getQueryParams(true, resetPage));
        await this.internalMailsService.getMails(this.getQueryParams(false, resetPage));
        this.total = this.internalMailsService.totalMails;
        this.internalMails$.next(this.allMails);
        await this.internalMailsService.mailsReady.promise;
        this.prepareTableParams(this.currentPage);
        this.readyMessages = true;
        this.cdr.markForCheck();
    }

    private getQueryParams(isTotalRequest: boolean, resetPage: boolean): IMessagesRequestParams {
        const queryParams: IMessagesRequestParams = {};
        queryParams.dateTo = this.endDate?.endOf('day').subtract(dayjs().utcOffset(), 'minute')
            .format('YYYY-MM-DDTHH:mm:ss');
        if (this.startDate) {
            queryParams.dateFrom = this.startDate?.startOf('day').subtract(dayjs().utcOffset(), 'minute')
                .format('YYYY-MM-DDTHH:mm:ss');
        }

        if (this.filterValue !== 'all') {
            queryParams.status = messagesFilterStatus[this.filterValue];
        }

        if (resetPage) {
            this.currentPage = 1;
        }

        if (!isTotalRequest) {
            queryParams.limit = this.$params.tableConfig.pageCount;
            queryParams.page = this.currentPage;
        }
        return queryParams;
    }
}
