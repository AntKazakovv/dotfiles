import {Subject} from 'rxjs';

import {ChatHelper} from 'wlc-engine/modules/chat/system/classes/chat.helper';
import {IMessage} from 'wlc-engine/modules/chat/system/interfaces';

export class MessageStore {
    public readonly messages$: Subject<IMessage> = new Subject();
    public readonly messages: IMessage[] = [];
    public readonly messageIdToMessage: Map<string, IMessage> = new Map();

    public addMessage(message: IMessage): void {
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

        this.messages.push(message);
        this.messageIdToMessage.set(message.id, message);
        this.messages$.next(message);
    }

    public clearHistory(): void {
        this.messages.length = 0;
        this.messageIdToMessage.clear();
    }
}
