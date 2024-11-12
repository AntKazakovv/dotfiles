import {
    computed,
    effect,
    inject,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import dayjs, {Dayjs} from 'dayjs';

import {CashbackPlanModel} from 'wlc-engine/modules/cashback/system/models';
import {CashbackService} from 'wlc-engine/modules/cashback/system/services';

export interface ICashbackTimerController {
    closestCashback: Signal<CashbackPlanModel | undefined>;
    fetchCashbackPlans(): void;
    ready: Signal<boolean>;
    timerValue: Dayjs;
}

export class CashbackTimerController implements ICashbackTimerController {
    public closestCashback = computed(() => {
        return this.getClosestCashback(this.plans());
    });
    protected readonly cashbackService: CashbackService = inject(CashbackService);
    protected plans: Signal<CashbackPlanModel[]> = toSignal(this.cashbackService.cashbackPlans);
    protected refetchEffect = effect((onCleanup) => {
        let timerId: NodeJS.Timeout;

        if (this.closestCashback()?.isPending) {
            if (!timerId) {
                timerId = setTimeout(() => {
                    this.fetchCashbackPlans();
                }, 15000);
            } else {
                clearTimeout(timerId);
                timerId = null;
            }
        }

        onCleanup(() => {
            clearTimeout(timerId);
        });
    });
    private _ready: WritableSignal<boolean> = signal(false);

    public get ready(): Signal<boolean> {
        return this._ready.asReadonly();
    }

    public get timerValue(): Dayjs {
        return dayjs(this.closestCashback()?.availableAt)
            .add(dayjs().utcOffset(), 'minute');
    }

    public fetchCashbackPlans(): void {
        this.cashbackService.fetchCashback()
            .finally(() => this._ready.set(true));
    }

    protected getClosestCashback(plans: CashbackPlanModel[]): CashbackPlanModel | undefined {
        return plans.filter(cashback => cashback.type === 'cron')
            .sort((a, b) =>
                dayjs(a.availableAt).valueOf() - dayjs(b.availableAt).valueOf(),
            )[0];
    }
}
