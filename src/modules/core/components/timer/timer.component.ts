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
    ElementRef,
    Renderer2,
    NgZone,
    inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

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
    TimerService,
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
    @Input() public timeRemaining: number;
    @Input() public text: string;
    @Input() public noCountDown: boolean;
    @Input() public countUp: boolean;
    @Input() public noDays: boolean;
    @Input() public noHours: boolean;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public serverDateUTC: number;
    @Input() protected inlineParams: Params.ITimerCParams;

    @Output() public timerEnds = new EventEmitter();

    public override $params: Params.ITimerCParams;

    public seconds: string = '00';
    public minutes: string = '00';
    public hours: string = '00';
    public days: string = '00';
    //circle length, 2*Pi*R
    protected fullCircle: number = 283;
    protected initialValue: number;
    protected afterCorrected: boolean = false;

    protected readonly ngZone = inject(NgZone);

    private valueFormat: DateTime;
    private secondsToDday: number;
    private minutesToDday: number;
    private hoursToDday: number;
    private daysToDday: number;
    private reg: RegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    private intervalSub: Subscription;
    private isInited: boolean = false;
    private timeDifference: number;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITimerCParams,
        @Inject(DOCUMENT) protected document: Document,
        protected element: ElementRef,
        protected renderer: Renderer2,
        configService: ConfigService,
        protected timerService: TimerService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        const inputProperties: string[] = [
            'value', 'text', 'noCountDown', 'countUp', 'noDays', 'noHours', 'theme', 'useDateUTC', 'serverDateUTC',
        ];
        super.ngOnInit(_merge(
            {},
            this.inlineParams,
            GlobalHelper.prepareParams(this, inputProperties),
        ));

        if (this.serverDateUTC && (this.serverDateUTC !== this.timerService.lastServerDateUTC)) {
            this.timerService.updateCount(this.serverDateUTC);
        }

        if (this.checkValueFormat()) {
            this.getTimeDifference();

            this.ngZone.runOutsideAngular(() => {
                this.intervalSub = interval(DateHelper.milliSecondsInSecond)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe(() => {
                        this.getTimeDifference();
                        this.cdr.markForCheck();
                    });
            });
        }
        if (this.$params.theme === 'wolf') {
            this.$params.dividers.units = '';
        }

        this.isInited = true;
    }

    public override ngOnChanges(changes: SimpleChanges): void {
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

            if (this.$params.theme === 'circle') {
                this.initialValue = Math.ceil(this.valueFormat.toSeconds() - DateTime.local().toSeconds());
            }

            return DateTime.isDateTime(this.$params.common?.value);
        }
    }

    protected getCalculateFraction(): number {
        let timeFraction: number = this.timeRemaining / this.initialValue;
        timeFraction = Math.floor((timeFraction - (1 / this.initialValue) * (1 - timeFraction)) * this.fullCircle);
        timeFraction = this.fullCircle - timeFraction;
        this.afterCorrected = true;

        return timeFraction;
    }

    protected setCircleDasharray(timeLeft: number): void {
        let timeFraction: number = timeLeft / this.initialValue;
        timeFraction = Math.floor((timeFraction - (1 / this.initialValue) * (1 - timeFraction)) * this.fullCircle);

        this.afterCorrected
            ? timeFraction
            : timeFraction = timeFraction - this.getCalculateFraction();

        const circleDasharray = `${timeFraction.toFixed(0)} ${this.fullCircle}`;
        const timerCircle = this.element.nativeElement.querySelector('.wlc-timer__path-remaining');

        if (timerCircle) {

            if (timeFraction > 0) {
                this.renderer.setAttribute(timerCircle, 'stroke-dasharray', circleDasharray);
            } else {
                this.renderer.setAttribute(timerCircle, 'display', 'none');
            }
        }
    }

    private getTimeDifference(): void {
        if (this.serverDateUTC) {
            if (this.timerService.timeCounter) {
                this.timeDifference = this.valueFormat.toMillis() - this.timerService.timeCounter;
            } else {
                return;
            }
        } else {
            this.timeDifference = this.valueFormat.toMillis() - DateTime.local().toMillis();
        }

        if (this.timeDifference < 0 && this.countUp) {
            this.timeDifference *= -1;
        }

        if (this.timeDifference > 0) {

            if (this.$params.theme === 'circle' && this.timeRemaining) {
                this.timeDifference = this.timeDifference - ((this.initialValue - this.timeRemaining) * 1000);

                if (this.timeDifference <= 0) {
                    this.timeDifference = 0;
                }
            }
            this.allocateTimeUnits(this.timeDifference);
        }

        if (this.intervalSub && this.timeDifference <= 0 && !this.countUp) {
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.timerEnds.emit();
                }, 1000);
            });

            this.intervalSub.unsubscribe();
            this.intervalSub = null;

            if (this.$params.theme === 'circle') {
                this.allocateTimeUnits(0);
            }
        }
    }

    private allocateTimeUnits(timeDifference: number): void {
        this.secondsToDday = Math.floor(timeDifference
            / DateHelper.milliSecondsInSecond % DateHelper.secondsInMinute);
        this.minutesToDday = Math.floor(timeDifference / DateHelper.milliSecondsInMinutes % DateHelper.minutesInHour);
        this.hoursToDday = Math.floor(timeDifference / DateHelper.milliSecondsInHours % DateHelper.hoursInDay);
        this.daysToDday = Math.floor(timeDifference / DateHelper.milliSecondsInDay);

        if (this.$params.common.noHours) {
            this.minutesToDday = Math.floor(timeDifference / DateHelper.milliSecondsInMinutes);
        }

        this.seconds = ('0' + this.secondsToDday).slice(-2);
        this.hours = ('0' + this.hoursToDday).slice(-2);

        if (this.daysToDday > 99) {
            this.days = String(this.daysToDday).slice(-3);
        } else {
            this.days = ('0' + this.daysToDday).slice(-2);
        }

        if (this.minutesToDday > 99) {
            this.minutes = String(this.minutesToDday).slice(-3);
        } else {
            this.minutes = ('0' + this.minutesToDday).slice(-2);
        }

        if (this.$params.theme === 'circle') {
            this.setCircleDasharray(Math.ceil(timeDifference / DateHelper.milliSecondsInSecond));
        }
    }
}
