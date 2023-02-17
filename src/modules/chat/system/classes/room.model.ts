import {
    BehaviorSubject,
    Observable,
} from 'rxjs';

import {MessageStore} from 'wlc-engine/modules/chat/system/classes/message-store.class';
import {IContact} from 'wlc-engine/modules/chat/system/services/chat.service';

export type TRoomStatus = 'connected' | 'disconnected' ;

export class RoomModel {
    public readonly messageStore: MessageStore = new MessageStore();
    public readonly contacts: Map<string, IContact> = new Map([]);

    protected readonly _status$: BehaviorSubject<TRoomStatus> = new BehaviorSubject('disconnected');

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly imgKey: string,
        public readonly address: string,
    ) {}

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
