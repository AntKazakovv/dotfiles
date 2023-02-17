import {filter} from 'rxjs/operators';
import {
    BehaviorSubject,
    Observable,
    Subscription,
} from 'rxjs';
import {Injectable} from '@angular/core';
import {DialogModel} from 'wlc-engine/modules/chat/system/classes/dialog.model';
import {IDialogParams, TDialogStatus} from 'wlc-engine/modules/chat/system/interfaces';


@Injectable({providedIn: 'root'})
export class DialogService {
    private _dialogs$: BehaviorSubject<DialogModel<unknown> | null> = new BehaviorSubject(null);
    private _observers$: Map<string, Subscription> = new Map();
    private _dialogs: Map<string, DialogModel<unknown>> = new Map();

    public get dialogs$(): Observable<DialogModel<unknown>> {
        return this._dialogs$.asObservable();
    }

    public get dialogs(): DialogModel<unknown>[] {
        return Array.from(this._dialogs).map((value: [string, DialogModel<unknown>]) => {
            return value[1];
        }).sort((a, b) => {
            return a.dateCreated.getTime() > b.dateCreated.getTime() ? 1 : -1;
        });
    }

    public show<T>(id: string, params: IDialogParams): DialogModel<T> {
        if (this._dialogs.has(id)) {
            return this._dialogs.get(id) as DialogModel<T>;
        } else {
            const modal: DialogModel<T> = new DialogModel(id, params);
            this._dialogs.set(id, modal);
            this._observers$.set(id, this.dialogSubscriber<T>(modal));
            this._dialogs$.next(modal);
            modal.show();
            return modal;
        }
    }

    public async hide(id: string, reason: string = 'service'): Promise<void> {
        if (this._dialogs.has(id)) {
            await this._dialogs.get(id).hide(reason);
            this.closeModal(id);
        }
    }

    public async hideAll(reason: string = 'service'): Promise<void> {
        for (const dialog of this._dialogs.keys()) {
            await this.hide(dialog, reason);
        }
    }

    public getDialog(id: string): DialogModel<unknown> {
        return this._dialogs.get(id);
    }

    protected closeModal(id: string): void {
        this._dialogs.delete(id);
        this._observers$.get(id).unsubscribe();
        this._observers$.delete(id);
        this._dialogs$.next(null);
    }

    protected dialogSubscriber<T>(modal: DialogModel<T>): Subscription {
        return modal.status$
            .pipe(filter((status: TDialogStatus) => status === 'hidden'))
            .subscribe(() => this.closeModal(modal.id));
    }
}
