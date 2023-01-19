import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnChanges,
    Output,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';

import {DateTime} from 'luxon';
import {
    interval,
    Subscription,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _isString from 'lodash-es/isString';
import _merge from 'lodash-es/merge';

import {
    GlobalHelper,
    ConfigService,
    DateHelper,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';

import * as Params from './timer.params';

/**
 * timer value format 'yyyy-MM-dd HH:mm:ss' or luxon format
 *
 * @example
 *
 * <div wlc-timer
 *      class="{{$class}}__timer"
 *      [value]="$params.common.bonus?.expirationTimeLuxon"
 *      text="Time remaining">
 * </div>
 *
 */
@Component({
    selector: '[wlc-timer]',
    templateUrl: './timer.component.html',
    styleUrls: ['./styles/timer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() public value: string | DateTime;
    @Input() public text: string;
    @Input() public noCountDown: boolean;
    @Input() public countUp: boolean;
    @Input() public noDays: boolean;
    @Input() public noHours: boolean;
    @Input() public themeMod: Params.ThemeMod;
    @Input() protected inlineParams: Params.ITimerCParams;

    @Output() public timerEnds = new EventEmitter();

    public $params: Params.ITimerCParams;

    public seconds: string = '00';
    public minutes: string = '00';
    public hours: string = '00';
    public days: string = '00';

    private valueFormat: DateTime;
    private secondsToDday: number;
    private minutesToDday: number;
    private hoursToDday: number;
    private daysToDday: number;
    private reg: RegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    private intervalSub: Subscription;
    private isInited: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITimerCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        const inputProperties: string[] = ['value', 'text', 'noCountDown', 'countUp', 'noDays', 'noHours'];
        super.ngOnInit(_merge(
            {},
            this.inlineParams,
            GlobalHelper.prepareParams(this, inputProperties),
        ));
        if (this.checkValueFormat()) {
            this.getTimeDifference();
            this.intervalSub = interval(DateHelper.milliSecondsInSecond).pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.getTimeDifference();
                    this.cdr.detectChanges();
                });
        }
        this.isInited = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.isInited && (!this.intervalSub || changes['value'])) {
            this.ngOnInit();
        }
    }

    public showDays(): boolean {
        return !(this.$params.common.noDays && this.daysToDday === 0);
    }

    public checkValueFormat(): boolean {
        if (_isString(this.$params.common?.value)) {
            this.valueFormat = DateTime.fromSQL(this.$params.common?.value as string);
            return this.reg.test(this.$params.common?.value as string);
        } else {
            this.valueFormat = this.$params.common?.value as DateTime;
            return DateTime.isDateTime(this.$params.common?.value);
        }
    }

    private getTimeDifference(): void {

        let timeDifference = this.valueFormat.toMillis() - DateTime.local().toMillis();

        if (timeDifference < 0 && this.countUp) {
            timeDifference *= -1;
        }

        if (timeDifference > 0) {
            this.allocateTimeUnits(timeDifference);
        }

        if (this.intervalSub && timeDifference <= 0 && !this.countUp) {
            setTimeout(() => {
                this.timerEnds.emit();
            }, 1000);
            this.intervalSub.unsubscribe();
            this.intervalSub = null;
        }
    }

    private allocateTimeUnits(timeDifference: number): void {
        this.secondsToDday = Math.floor(timeDifference
            / DateHelper.milliSecondsInSecond % DateHelper.secondsInMinute);
        this.minutesToDday = Math.floor(timeDifference / DateHelper.milliSecondsInMinutes % DateHelper.minutesInHour);
        this.hoursToDday = Math.floor(timeDifference / DateHelper.milliSecondsInHours % DateHelper.hoursInDay);
        this.daysToDday = Math.floor(timeDifference / DateHelper.milliSecondsInDay);

        this.seconds = ('0' + this.secondsToDday).slice(-2);
        this.minutes = ('0' + this.minutesToDday).slice(-2);
        this.hours = ('0' + this.hoursToDday).slice(-2);
        this.days = ('0' + this.daysToDday).slice(-2);
    }
}
