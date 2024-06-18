import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {TransitionService} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IHistoryFilter} from 'wlc-engine/modules/history/system/interfaces/history-filter.interface';
import {HistoryFilterService} from 'wlc-engine/modules/history/system/services/history-filter.service';

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
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected transition: TransitionService,
    ) {
        super(
            <IMixedParams<Params.IHistoryRangeCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
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
                    ? historyFilter.startDate.format('DD.MM.YYYY')
                    : this.startDate;
                this.endDate = historyFilter.endDate
                    ? historyFilter.endDate.format('DD.MM.YYYY')
                    : this.endDate;
                this.ready = true;
                this.cdr.detectChanges();
            });
    }
}
