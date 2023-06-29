import {
    BehaviorSubject,
    Observable,
} from 'rxjs';

import {MessageStore} from 'wlc-engine/modules/chat/system/classes/message-store.class';
import {IContact} from 'wlc-engine/modules/chat/system/services/chat.service';
import {GlobalHelper} from 'wlc-engine/modules/core';

export type TRoomStatus = 'connected' | 'disconnected' ;

export class RoomModel {
    public readonly messageStore: MessageStore = new MessageStore();
    public readonly contacts: Map<string, IContact> = new Map([]);
    public readonly image!: string;

    protected readonly _status$: BehaviorSubject<TRoomStatus> = new BehaviorSubject('disconnected');

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgKey: string,
        public readonly address: string,
    ) {
        this.image = GlobalHelper.gstaticUrl + `/wlc/flags/1x1/${imgKey}.svg`;
    }

    public get status$(): Observable<TRoomStatus> {
        return this._status$.asObservable();
    }

    public get status(): TRoomStatus {
        return this._status$.getValue();
    }

    /**
     * Clear messages on disconnect
     */
    public disconnect(): void {
        this.messageStore.clearHistory();
        this._status$.next('disconnected');
    }

    public connect(): void {
        this._status$.next('connected');
    }
}
