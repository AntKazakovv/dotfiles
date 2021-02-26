import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {filter, takeUntil} from "rxjs/operators";

import {
    AbstractComponent,
    ConfigService,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {HistoryFilterService} from 'wlc-engine/modules/finances/system/services';

import * as Params from './history-range.params';
import {sortBy as _sortBy} from "lodash-es";
import {TransitionService} from "@uirouter/core";

@Component({
    selector: '[wlc-history-range]',
    templateUrl: './history-range.component.html',
    styleUrls: ['./styles/history-range.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryRangeComponent extends AbstractComponent implements OnInit {
    @Input() public startDate: string;
    @Input() public endDate: string;

    public $params: any;
    public ready: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: any,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected cdr: ChangeDetectorRef,
        protected transition: TransitionService,
    )
    {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.subscribeOnDateChanges();

        this.transition.onSuccess({}, async () => {
            this.ready = false;
            this.cdr.detectChanges();
        });
    }

    public subscribeOnDateChanges(): void {
        this.historyFilterService.dateChanges$
            .pipe(filter(date => !!date))
            .subscribe((value) => {
                this.endDate = value?.endDate.toFormat("y-LL-dd TT");
                this.startDate = value?.startDate.toFormat("y-LL-dd TT");
                this.ready = true;
                this.cdr.detectChanges();
            });
    }
}
