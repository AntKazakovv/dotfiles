import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    inject,
    DestroyRef,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {
    EventService,
    RouterService,
    TLifecycleEvent,
    IMixedParams,
    AbstractComponent,
} from 'wlc-engine/modules/core';

import {
    HistoryFilterService,
    IHistoryFilter,
} from 'wlc-engine/modules/history';

import * as Params from './history-range.params';

@Component({
    selector: '[wlc-history-range]',
    templateUrl: './history-range.component.html',
    styleUrls: ['./styles/history-range.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryRangeComponent extends AbstractComponent implements OnInit {
    @Input() private inlineParams: any;
    @Input() public startDate: string;
    @Input() public endDate: string;

    public override $params: Params.IHistoryRangeCParams;
    public ready: boolean;

    protected readonly destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly eventService: EventService = inject(EventService);
    protected readonly historyFilterService: HistoryFilterService = inject(HistoryFilterService);
    protected readonly routerService: RouterService = inject(RouterService);

    constructor(
        @Inject('injectParams') protected params: Params.IHistoryRangeCParams,
    ) {
        super(
            <IMixedParams<Params.IHistoryRangeCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.subscribeToDateChanges();
        this.subscribeToRouterEvents();
    }

    protected subscribeToDateChanges(): void {
        (this.historyFilterService.history[this.$params.historyType] as BehaviorSubject<IHistoryFilter>)
            .pipe(filter((historyFilter: IHistoryFilter<string>): boolean => !!historyFilter))
            .subscribe((historyFilter: IHistoryFilter<string>): void => {
                this.startDate = historyFilter.startDate
                    ? historyFilter.startDate.format('DD.MM.YYYY')
                    : this.startDate;
                this.endDate = historyFilter.endDate
                    ? historyFilter.endDate.format('DD.MM.YYYY')
                    : this.endDate;
                this.ready = true;
                this.cdr.markForCheck();
            });
    }

    protected subscribeToRouterEvents(): void {
        this.routerService.events$.pipe(
            filter((event: TLifecycleEvent) => event.name === 'onSuccess'),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => {
            this.ready = false;
            this.cdr.markForCheck();
        });
    }
}
