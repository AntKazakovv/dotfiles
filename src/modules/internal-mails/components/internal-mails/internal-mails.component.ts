import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    DateTime,
    ToObjectOutput,
} from 'luxon';
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
    IDatepickerCParams,
    startDate,
    endDate,
    HistoryFilterService,
    IHistoryFilter,
    ActionService,
    DeviceType,
} from 'wlc-engine/modules/core';
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
    public $params: Params.IInternalMailsCParams;
    public internalMailsCount: number = 0;
    public showFilter: boolean = false;
    public startDateInput: IDatepickerCParams = _cloneDeep(startDate);
    public endDateInput: IDatepickerCParams = _cloneDeep(endDate);
    public tableData: ITableCParams;
    protected startDate: DateTime = DateTime.local();
    protected endDate: DateTime = DateTime.local().endOf('day');
    protected internalMails$: BehaviorSubject<InternalMailModel[]> = new BehaviorSubject([]);
    protected allMails: InternalMailModel[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IInternalMailsCParams,
        protected internalMailsService: InternalMailsService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected historyFilterService: HistoryFilterService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.IInternalMailsCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public async ngOnInit(): Promise<void> {
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
            return DateTime.fromSQL(item.dateISO, {zone: 'utc'}) >= this.startDate
                && DateTime.fromSQL(item.dateISO, {zone: 'utc'}) <= this.endDate;
        });
    }

    protected setMinMaxDate(): void {
        const disableSince: ToObjectOutput = this.endDate.plus({day: 1}).toObject();
        const disableUntil: ToObjectOutput = this.startDate.minus({day: 1}).toObject();

        this.startDateInput.control.setValue(this.startDate);
        this.endDateInput.control.setValue(this.endDate);
        this.startDateInput.datepickerOptions = {
            disableSince: {
                year: disableSince.year,
                month: disableSince.month,
                day: disableSince.day,
            },
        };
        this.endDateInput.datepickerOptions = {
            disableUntil: {
                year: disableUntil.year,
                month: disableUntil.month,
                day: disableUntil.day,
            },
        };
    }

    protected initFilters(): void {
        if (this.allMails.length) {
            this.startDate = DateTime.fromSQL(_last(this.allMails).dateISO, {zone: 'utc'}).toLocal();
        }

        this.setMinMaxDate();

        this.historyFilterService.setAllFilters('mails', {
            startDate: this.startDate,
            endDate: this.endDate,
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
                this.internalMailsCount = mails.length;

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
                takeUntil(this.$destroy),
                filter((data: IHistoryFilter): boolean => !!data),
            )
            .subscribe((data: IHistoryFilter): void => {
                this.startDateInput.control.setValue(this.startDate = data.startDate);
                this.endDateInput.control.setValue(this.endDate = data.endDate);
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
                filter((startDate: DateTime): boolean => this.startDate.toMillis() !== startDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((startDate: DateTime): void => {
                this.historyFilterService.setFilter('mails', {startDate: this.startDate = startDate});
                this.internalMails$.next(this.filterMails());
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: DateTime): boolean => this.endDate.toMillis() !== endDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((endDate: DateTime): void => {
                this.historyFilterService.setFilter('mails', {endDate: this.endDate = endDate});
                this.internalMails$.next(this.filterMails());
            });
    }
}
