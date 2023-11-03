import {Injectable} from '@angular/core';

import {
    EventService,
    ConfigService,
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core';

import {
    BehaviorSubject,
    Observable,
} from 'rxjs';

const mailVerificationKey = 'd38vlsg9';
const restorePasswordKey = 'lksufr720v';

@Injectable({
    providedIn: 'root',
})
export class TimeLimitService {
    protected isAuth: boolean;
    protected _waitMailVerification$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected _waitRestore$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private restoreTimerTime: number;
    private emailTimerTime: number;
    private timerVerification: ReturnType<typeof setTimeout>;
    private timerRestorePass: ReturnType<typeof setTimeout>;

    constructor(
        private eventService: EventService,
        private configService: ConfigService,
    ) {
        this.init();
    }

    public async init(): Promise<void> {
        await this.configService.ready;
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        const isVerified: boolean = this.configService.get({
            name: 'verified',
            storageType: 'localStorage',
        });

        this.emailTimerTime = this.configService
            .get<number>('$modules.user.mailVerificationTimer') || 300000;

        if (this.isAuth && !isVerified) {
            this.checkTime('mailVerification');

            this.eventService.subscribe({
                name: 'EMAIL_VERIFY',
            }, (): void => {
                this.stopTimer('mailVerification');
            });

        } else {
            this.checkTime('restorePassword');
        }

        this.eventService.subscribe([
            {name: 'LOGIN'},
        ], (): void => {
            this.stopTimer('restorePassword');
        });
    }

    public setRestoreTimerTime(time: number): void {
        this.restoreTimerTime = time;
    }

    public setTime(initiator: string): void {
        let whenTimerEnds: number;

        switch (initiator) {

            case 'mailVerification':
                whenTimerEnds = Date.now() + this.emailTimerTime;
                this.setToStorage(mailVerificationKey, whenTimerEnds);
                this.startTimer(initiator, this.emailTimerTime);
                break;
            case 'restorePassword':
                whenTimerEnds = Date.now() + this.restoreTimerTime;
                this.setToStorage(restorePasswordKey, whenTimerEnds);
                this.startTimer(initiator, this.restoreTimerTime);
                break;
        }
    };

    public showNotification(timerTime?: number): void {
        const displayedTimerTime: number = timerTime || this.emailTimerTime;
        const minutes: number = displayedTimerTime / 60000;

        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Error'),
                // eslint-disable-next-line max-len
                message: gettext('The request has already been sent. You can send a request once every {{minutes}} minutes'),
                messageContext: {
                    minutes: minutes,
                },
                wlcElement: 'notification_verification-error',
            },
        });
    }

    public get waitMailVerification$(): Observable<boolean> {
        return this._waitMailVerification$.asObservable();
    }

    public get waitMailVerification(): boolean {
        return this._waitMailVerification$.getValue();
    }

    public get waitRestore$(): Observable<boolean> {
        return this._waitRestore$.asObservable();
    }

    public get waitRestore(): boolean {
        return this._waitRestore$.getValue();
    }

    private async checkTime(initiator: string): Promise<void> {
        let whenTimerEnds: number;

        switch (initiator) {

            case 'mailVerification':
                whenTimerEnds = this.getFromStorage(mailVerificationKey);
                break;
            case 'restorePassword':
                whenTimerEnds = this.getFromStorage(restorePasswordKey);
                break;
        }

        if (whenTimerEnds > Date.now()) {
            this.startTimer(initiator, (whenTimerEnds - Date.now()));
        }
    }

    private startTimer(initiator: string, time: number): void {

        switch (initiator) {

            case 'mailVerification':
                this._waitMailVerification$.next(true);

                this.timerVerification = setTimeout(() => {
                    this.stopTimer('mailVerification');
                }, time);
                break;
            case 'restorePassword':
                this._waitRestore$.next(true);

                this.timerRestorePass = setTimeout(() => {
                    this.stopTimer('restorePassword');
                }, time);
                break;
        }
    }

    private stopTimer(initiator: string): void {

        switch (initiator) {

            case 'mailVerification':
                clearTimeout(this.timerVerification);
                this.clearStorage(mailVerificationKey);
                this._waitMailVerification$.next(false);
                break;

            case 'restorePassword':
                clearTimeout(this.timerRestorePass);
                this.clearStorage(restorePasswordKey);
                this._waitRestore$.next(false);
                break;
        }
    }

    private setToStorage(name: string, value: number): void {
        this.configService.set({
            name: name,
            value: value,
            storageType: 'localStorage',
        });
    }

    private getFromStorage(name: string): number {
        return this.configService.get({
            name: name,
            storageType: 'localStorage',
        });
    }

    private clearStorage(name: string): void {
        this.configService.set({
            name: name,
            value: null,
            storageClear: 'localStorage',
        });
    }
}
