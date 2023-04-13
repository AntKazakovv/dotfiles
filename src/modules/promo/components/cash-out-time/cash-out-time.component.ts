import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import _random from 'lodash-es/random';

import {
    AbstractComponent,
    CachingService,
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './cash-out-time.params';

@Component({
    selector: '[wlc-cash-out-time]',
    templateUrl: './cash-out-time.component.html',
    styleUrls: ['./styles/cash-out-time.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashOutTimeComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICashOutTimeCParams;

    public override $params: Params.ICashOutTimeCParams;
    public minutes: number;
    public seconds: number;

    constructor(
        public elementRef: ElementRef,
        @Inject('injectParams') protected injectParams: Params.ICashOutTimeCParams,
        configService: ConfigService,
        protected cachingService: CachingService,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ICashOutTimeCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.initTime();

        timer(this.$params.intervalChangingValue)
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => this.calcTime());
    }

    protected calcTime(): void {
        const {minutes, seconds} = this.$params;
        this.minutes = _random(minutes.from, minutes.to);
        this.seconds = _random(seconds.from, seconds.to);
        this.cachingService.set<Params.ITimeStorage>(
            'cash-out-time',
            {minutes: this.minutes, seconds: this.seconds},
            false,
            this.$params.intervalChangingValue,
        );
        this.cdr.markForCheck();
    }

    protected async initTime(): Promise<void> {
        const result = await this.cachingService.get<Params.ITimeStorage>('cash-out-time');

        if (result) {
            this.minutes = result.minutes;
            this.seconds = result.seconds;
        } else {
            this.calcTime();
        }

        this.cdr.markForCheck();
    }
}
