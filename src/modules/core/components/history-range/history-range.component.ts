import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {TransitionService} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IHistoryFilter} from 'wlc-engine/modules/core/system/interfaces/history-filter.interface';
import {HistoryFilterService} from 'wlc-engine/modules/core/system/services/history-filter/history-filter.service';

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

    constructor(
        @Inject('injectParams') protected params: Params.IHistoryRangeCParams,
        configService: ConfigService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        cdr: ChangeDetectorRef,
        protected transition: TransitionService,
    ) {
        super(
            <IMixedParams<Params.IHistoryRangeCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.subscribeOnDateChanges();

        this.transition.onSuccess({}, async () => {
            this.ready = false;
            this.cdr.detectChanges();
        });
    }

    public subscribeOnDateChanges(): void {
        (this.historyFilterService.history[this.$params.historyType] as BehaviorSubject<IHistoryFilter>)
            .pipe(filter((historyFilter: IHistoryFilter<string>): boolean => !!historyFilter))
            .subscribe((historyFilter: IHistoryFilter<string>): void => {
                this.startDate = historyFilter.startDate
                    ? historyFilter.startDate.toFormat('dd-LL-yyyy')
                    : this.startDate;
                this.endDate = historyFilter.endDate
                    ? historyFilter.endDate.toFormat('dd-LL-yyyy')
                    : this.endDate;
                this.ready = true;
                this.cdr.detectChanges();
            });
    }
}
