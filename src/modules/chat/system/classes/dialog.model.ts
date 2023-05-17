import {
    BehaviorSubject,
    firstValueFrom,
    Observable,
    timer,
} from 'rxjs';
import {
    first,
    tap,
} from 'rxjs/operators';

import {
    IDialogParams,
    TDialogCloseReason,
    TDialogStatus,
} from 'wlc-engine/modules/chat/system/interfaces';

export const DEFAULT_DIALOG_PARAMS: Readonly<IDialogParams> = {
    showFooter: true,
    showClose: true,
    closeByBackdrop: true,
    dialogClasses: '',
};

export class DialogModel<T> {
    public readonly dateCreated: Date;
    private _status$: BehaviorSubject<TDialogStatus> = new BehaviorSubject('created');
    private _reason: string = '';

    constructor(
        public readonly id: string = '',
        public readonly params: IDialogParams<T> = {},
    ) {
        this.dateCreated = new Date();
        this.params = Object.assign({}, DEFAULT_DIALOG_PARAMS, this.params);
    }

    public get status$(): Observable<TDialogStatus> {
        return this._status$.asObservable();
    }

    public async onOpened(callback?: () => Promise<void> | void): Promise<void> {
        await firstValueFrom(this.status$.pipe(first((s) => s === 'opened')));

        if (callback) {
            await callback();
        }
    }

    public async onHidden(callback?: (reason: string) => Promise<void> | void): Promise<string> {
        await firstValueFrom(this.status$.pipe(first((s) => s === 'hidden')));

        if (callback){
            await callback(this._reason);
        }

        return this._reason;
    }

    public async show(): Promise<void> {
        return new Promise((resolve) => {
            this._status$.next('opening');

            timer(300).pipe(tap(() => {
                this._status$.next('opened');
                resolve();
            })).subscribe();
        });
    }

    public async hide(reason: TDialogCloseReason): Promise<TDialogCloseReason> {
        if (reason === 'backdrop' && !this.params.closeByBackdrop) {
            return;
        }

        this._reason = reason;

        return new Promise((resolve) => {
            this._status$.next('hiding');

            timer(300).pipe(tap(() => {
                this._status$.next('hidden');
                resolve(reason);
            })).subscribe();
        });
    }
}
