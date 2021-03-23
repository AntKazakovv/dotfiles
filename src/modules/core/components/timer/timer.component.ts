import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {
    AbstractComponent,
    GlobalHelper,
    ConfigService,
} from 'wlc-engine/modules/core';
import * as Params from './timer.params';

import {DateTime} from 'luxon';
import {interval} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    isString as _isString,
    each as _each,
} from 'lodash-es';

/**
 * timer value format 'yyyy-MM-dd HH:mm:ss' or luxon format
 *
 * @example
 *
 * <div class="{{$class}}__timer" wlc-timer [value]="$params.common.bonus?.expirationTimeLuxon" text="Time remaining"></div>
 *
 */
@Component({
    selector: '[wlc-timer]',
    templateUrl: './timer.component.html',
    styleUrls: ['./styles/timer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent extends AbstractComponent implements OnInit {
    @Input() public value: string | DateTime;
    @Input() public text: string;
    @Input() public noCountDown: boolean;
    @Input() public countUp: boolean;
    @Input() public noDays: boolean;
    @Input() public themeMod: Params.ThemeMod;
    @Input() protected inlineParams: Params.ITimerCParams;
    public $params: Params.ITimerCParams;

    public seconds: string = '00';
    public minutes: string = '00';
    public hours: string = '00';
    public days: string = '00';

    private valueFormat: DateTime;
    private milliSecondsInASecond = 1000;
    private hoursInADay = 24;
    private minutesInAnHour = 60;
    private secondsInAMinute  = 60;
    private secondsToDday: number;
    private minutesToDday: number;
    private hoursToDday: number;
    private daysToDday: number;
    private reg: RegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITimerCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        const inputProperties: string[] = ['value', 'text', 'noCountDown', 'countUp', 'noDays'];
        super.ngOnInit(GlobalHelper.prepareParams(this, inputProperties));

        if (this.checkValueFormat()) {
            this.getTimeDifference();
            interval(this.milliSecondsInASecond).pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.getTimeDifference();
                    this.cdr.markForCheck();
                });
        }
    }

    public showDays(): boolean {
        return !(this.noDays && this.daysToDday === 0);
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
    }

    private allocateTimeUnits(timeDifference: number): void {
        this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.secondsInAMinute);
        this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.secondsInAMinute);
        this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.secondsInAMinute) % this.hoursInADay);
        this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.secondsInAMinute * this.hoursInADay));

        this.seconds = ('0' + this.secondsToDday).slice(-2);
        this.minutes = ('0' + this.minutesToDday).slice(-2);
        this.hours = ('0' + this.hoursToDday).slice(-2);
        this.days = ('0' + this.daysToDday).slice(-2);
    }
}
