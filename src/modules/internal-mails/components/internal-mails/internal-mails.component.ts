import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
    takeWhile,
} from 'rxjs/operators';
import _filter from 'lodash-es/filter';
import _last from 'lodash-es/last';
import _cloneDeep from 'lodash-es/cloneDeep';
import _find from 'lodash-es/find';

import {
    ITableCParams,
    ConfigService,
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
import * as Params from './internal-mails.params';

@Component({
    selector: '[wlc-internal-mails]',
    templateUrl: './internal-mails.component.html',
    styleUrls: ['./styles/internal-mails.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalMailsComponent extends AbstractComponent implements OnInit {
    public ready: boolean = false;
    public override $params: Params.IInternalMailsCParams;
    public showFilter: boolean = false;
    public startDateInput: IDatepickerCParams = _cloneDeep(startDate);
    public endDateInput: IDatepickerCParams = _cloneDeep(endDate);
    public filterSelect: ISelectCParams<TInternalMailFilter> = _cloneDeep(internalMailsConfig.filterSelect);
    public tableData: ITableCParams;
    protected filterValue: TInternalMailFilter = 'all';
    protected startDate: Dayjs = dayjs();
    protected endDate: Dayjs = dayjs().endOf('day');
    protected internalMails$: BehaviorSubject<InternalMailModel[]> = new BehaviorSubject([]);
    protected allMails: InternalMailModel[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IInternalMailsCParams,
        protected internalMailsService: InternalMailsService,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected historyFilterService: HistoryFilterService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.IInternalMailsCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        await this.internalMailsService.mailsReady.promise;

        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        if (this.showFilter) {
            this.filterHandlers();
        }

        this.setSubscription();
    }

    protected filterMails(): InternalMailModel[] {
        return _filter(this.allMails, (item: InternalMailModel): boolean => {
            if (!item.dateISO) {
                return false;
            }
            return dayjs(item.dateISO, 'YYYY-MM-DDTHH:mm:ss').unix() >= this.startDate.unix()
            && dayjs(item.dateISO, 'YYYY-MM-DDTHH:mm:ss').unix() <= this.endDate.unix()
            && (item.status === this.filterValue || this.filterValue === 'all');
        });
    }

    protected setMinMaxDate(): void {
        this.startDateInput.control.setValue(this.startDate);
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

    protected initFilters(): void {
        if (this.allMails.length) {
            this.startDate = dayjs(_last(this.allMails).dateISO, 'YYYY-MM-DDTHH:mm:ss');
        }

        this.setMinMaxDate();

        this.historyFilterService.setAllFilters('mails', {
            startDate: this.startDate,
            endDate: this.endDate,
            filterValue: this.filterValue,
        });
        this.tableData = {
            head: Params.internalMailsTableHeadConfig,
            rows: this.internalMails$,
            switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
        };

        this.ready = true;
    }

    protected setSubscription(): void {
        this.internalMailsService.mails$
            .pipe(takeUntil(this.$destroy))
            .subscribe((mails: InternalMailModel[]): void => {
                this.allMails = mails;

                if (!this.ready) {
                    this.initFilters();
                } else {
                    this.internalMails$.next(this.filterMails());
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
            .subscribe((data: IHistoryFilter<TInternalMailFilter>): void => {
                this.startDateInput.control.setValue(this.startDate = data.startDate);
                this.endDateInput.control.setValue(this.endDate = data.endDate);
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.setMinMaxDate();

                this.internalMails$.next(this.filterMails());
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
        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: Dayjs): boolean => this.startDate.unix() !== startDate.unix()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((startDate: Dayjs): void => {
                this.historyFilterService.setFilter('mails', {startDate: this.startDate = startDate});
                this.internalMails$.next(this.filterMails());
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: Dayjs): boolean => this.endDate.unix() !== endDate.unix()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((endDate: Dayjs): void => {
                this.historyFilterService.setFilter('mails', {endDate: this.endDate = endDate});
                this.internalMails$.next(this.filterMails());
            });

        this.filterSelect.control.valueChanges
            .pipe(
                filter((value: TInternalMailFilter): boolean => this.filterValue !== value),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((value: TInternalMailFilter): void => {
                this.historyFilterService.setFilter('mails', {filterValue: this.filterValue = value});
                this.internalMails$.next(this.filterMails());
            });
    }
}
