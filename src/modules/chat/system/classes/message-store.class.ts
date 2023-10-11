import {Subject} from 'rxjs';
import _cloneDeep from 'lodash-es/cloneDeep';

import {ChatHelper} from 'wlc-engine/modules/chat/system/classes/chat.helper';
import {
    IMessage,
    INewMsg,
    IRetractMsg,
    IReplaceMsg,
} from 'wlc-engine/modules/chat/system/interfaces';

export class MessageStore {
    public readonly messages$: Subject<IMessage> = new Subject();
    public newMessages: INewMsg[] = [];
    public messageIdToMessage: Map<string, INewMsg> = new Map();

    public addMessage(message: INewMsg): void {
        if (!message.id) {
            message.id = ChatHelper.id();
        }

        if (message.id && this.messageIdToMessage.has(message.id)) {
            const msg = this.messageIdToMessage.get(message.id);

            if (msg.direction !== message.direction) {
                msg.direction = message.direction;
            }
            return;
        }

        this.newMessages.push(message);
        this.messageIdToMessage.set(message.id, message);
        this.messages$.next(message);
    }

    public deleteMessage(message: IRetractMsg): void {
        if (!this.newMessages.some(msg => msg?.id === message?.id)) {
            return;
        }

        const i = this.newMessages.findIndex(msg => msg?.id === message?.id);
        this.newMessages.splice(i, 1);
        this.messageIdToMessage.delete(message.id);
        this.messages$.next(message);
    }

    public replaceMessage(message: IReplaceMsg): void {
        let i: number;

        if (this.newMessages.some(msg => msg?.repId === message?.repId)) {

            i = this.newMessages.findIndex(msg => msg?.repId === message?.repId);
        } else if (this.newMessages.some(msg => msg?.id === message?.repId)) {

            i = this.newMessages.findIndex(msg => msg?.id === message?.repId);
        } else {
            return;
        }

        const msg: INewMsg = _cloneDeep(this.newMessages[i]);

        msg.body = message.body;
        msg.repId = message.repId;
        msg.id = message.id;
        this.newMessages[i] = msg;
        this.messageIdToMessage.set(message.repId, msg);
        this.messages$.next(message);
    }

    public clearHistory(): void {
        this.newMessages.length = 0;
        this.messageIdToMessage.clear();
    }
}
