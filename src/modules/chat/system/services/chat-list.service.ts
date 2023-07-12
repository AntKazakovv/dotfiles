import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    switchMap,
} from 'rxjs';

import {
    IMessage,
    INewMsg,
} from 'wlc-engine/modules/chat/system/interfaces';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';
import {ChatHelper} from 'wlc-engine/modules/chat/system/classes/chat.helper';
import {RoomModel} from 'wlc-engine/modules/chat/system/classes/room.model';


@Injectable({providedIn: 'root'})
export class ChatListService {
    private _unreadCounter$: BehaviorSubject<number> = new BehaviorSubject(0);

    private readonly _messages$: Observable<IMessage>;

    constructor(
        protected chatService: ChatService,
    ) {
        this._messages$ = this.chatService.activeRoomStr$
            .pipe(switchMap((room: RoomModel) => room.messageStore.messages$));
    }

    public addMessage(message: INewMsg): void {
        if (!message.id) {
            message.id = ChatHelper.id();
        }

        this.chatService.activeRoom.messageStore.addMessage(message);
    }

    public get messages(): INewMsg[] {
        return this.chatService.activeRoom.messageStore.newMessages;
    }

    public get messages$(): Observable<IMessage> {
        return this._messages$;
    }

    public get unreadCounter$(): Observable<number> {
        return this._unreadCounter$.asObservable();
    }

    public get unreadCounter(): number {
        return this._unreadCounter$.getValue();
    }

    public countUnread(): void {
        this._unreadCounter$.next(
            this.messages.filter((msg: INewMsg) => {
                return !msg.read;
            }).length,
        );
    }

    public readAllMessages(): void {
        this.messages.forEach((msg: INewMsg) => {
            msg.read = true;
        });

        this.countUnread();
    }
}
