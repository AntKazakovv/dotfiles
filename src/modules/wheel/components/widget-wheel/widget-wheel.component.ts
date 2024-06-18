import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {
    BehaviorSubject,
    takeUntil,
} from 'rxjs';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    ITimerCParams,
} from 'wlc-engine/modules/core';
import {IInfoWheelResponse} from 'wlc-engine/modules/wheel/system/interfaces/wheel.interface';
import {WheelService} from 'wlc-engine/modules/wheel/system/services/wheel.service';

import * as Params from './widget-wheel.params';

export type TButtonTemplate = 'timer' | 'title';

interface IDurationWheel {
    minutes: number;
    seconds: number;
}

@Component({
    selector: '[wlc-widget-wheel]',
    templateUrl: './widget-wheel.component.html',
    styleUrls: ['./styles/widget-wheel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetWheelComponent extends AbstractComponent implements OnInit {
    public shiftWidget$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public enableWheel$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public timerParams: ITimerCParams = {};
    public override $params: Params.IWidgetWheelCParams;
    public timerValue!: Dayjs;
    protected IDurationWheel: IDurationWheel;
    protected template$: BehaviorSubject<TButtonTemplate> = new BehaviorSubject<TButtonTemplate>('title');
    protected isExpired: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IWidgetWheelCParams,
        protected wheelService: WheelService,
    ) {
        super(<IMixedParams<Params.IWidgetWheelCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        if (this.configService.get<boolean>('appConfig.siteconfig.StreamWheel')) {
            this.timerParams = _merge(
                _cloneDeep(Params.timerParams),
                this.$params.timerParams,
            );
            this.initSubscriptions();
        }
    }

    public toggleWidget(): void {
        this.shiftWidget$.next(!this.shiftWidget$.value);
    }

    public async updateDuration(idWheel: number): Promise<void> {
        const infoWheel: IInfoWheelResponse = await this.wheelService.getInfoWheel(idWheel);
        const timeRemaining: string = this.wheelService.modifyDateTimeFormat(
            infoWheel.finishedAt, infoWheel.serverTime);
        this.IDurationWheel = {
            minutes: +timeRemaining.split(':')[0],
            seconds: +timeRemaining.split(':')[1],
        };
    }

    public async openWheel(): Promise<void> {
        this.wheelService.openWheel();
        this.toggleWidget();
    }

    public timerExpiry(): void {
        if (!this.isExpired) {
            this.wheelService.setTimerStatus(true);
            this.wheelService.internalTimeEnd();
            this.isExpired = true;
        }
    }

    protected setTimer(): void {
        this.timerValue = dayjs()
            .add(this.IDurationWheel.minutes, 'minute')
            .add(this.IDurationWheel.seconds, 'second');
        this.cdr.markForCheck();
    }

    protected async updateWidget(idWheel: number): Promise<void> {
        await this.updateDuration(idWheel);
        this.setTimer();
        this.template$.next('timer');
        this.enableWheel$.next(true);
    }

    protected initSubscriptions(): void {
        this.wheelService.eventsWheel$.pipe(takeUntil(this.$destroy))
            .subscribe((event): void => {
                switch (event.name) {
                    case 'deleteWidget':
                        this.enableWheel$.next(false);
                        this.isExpired = false;
                        break;
                    case 'resetWidget':
                        this.template$.next('title');
                        this.isExpired = false;
                        break;
                    case 'showWidget':
                        this.enableWheel$.next(true);
                        break;
                    case 'updateWidget':
                        this.updateWidget(event.data);
                        break;
                }
            });

        this.wheelService.wheelInfo$.pipe(takeUntil(this.$destroy))
            .subscribe((wheelInfo: IInfoWheelResponse): void => {
                const timeRemaining: string = this.wheelService.modifyDateTimeFormat(
                    wheelInfo.finishedAt, wheelInfo.serverTime);
                this.IDurationWheel = {
                    minutes: +timeRemaining.split(':')[0],
                    seconds: +timeRemaining.split(':')[1],
                };
                this.template$.next('timer');
                this.setTimer();
            });
    }
}
