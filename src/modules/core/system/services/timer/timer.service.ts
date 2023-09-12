import {Injectable} from '@angular/core';

import {
    interval,
    Subscription,
    Subject,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {DateHelper} from 'wlc-engine/modules/core/system/helpers/date.helper';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    public startedCount: boolean = false;
    public timeCounter: number = 0;
    public timeCounterSub: Subscription;
    public lastServerDateUTC: number;
    public lastTimeCounter: number;
    public lastTimeMark: number;

    protected stopper$: Subject<void> = new Subject();

    public startCount(): void {
        this.startedCount = true;
        this.timeCounter = this.lastServerDateUTC;
        this.timeCounterSub = interval(DateHelper.milliSecondsInSecond)
            .pipe(takeUntil(this.stopper$))
            .subscribe(() => {
                this.timeCounter += 1000;
            });
    }

    public updateCount(serverDateUTC: number): void {
        this.timeCounter = serverDateUTC;
        this.lastServerDateUTC = serverDateUTC;
        this.lastTimeMark = Date.now();
    }

    public stopCount(): void {
        this.stopper$.next();
        this.timeCounterSub = null;
        this.timeCounter = 0;
        this.startedCount = false;
    }

    public rememberLastCount(): void {
        this.lastTimeCounter = this.timeCounter;
        this.lastTimeMark = Date.now();
    }

    public updateCountAfterDocumentHidden(): void {
        const timeDifference = Date.now() - this.lastTimeMark;
        const timeDefferenceSeconds = timeDifference - (timeDifference % 1000);
        if (timeDefferenceSeconds > DateHelper.milliSecondsInSecond) {
            if (this.lastTimeCounter) {
                this.timeCounter = this.lastTimeCounter + timeDefferenceSeconds;
            } else {
                this.timeCounter = this.lastServerDateUTC + timeDefferenceSeconds;
            }
        }
    }
}
