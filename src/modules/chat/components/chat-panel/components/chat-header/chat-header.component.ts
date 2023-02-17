import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';

@Component({
    selector: '[wlc-chat-header]',
    templateUrl: './chat-header.component.html',
    styleUrls: ['./chat-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatHeaderComponent extends AbstractChatComponent {

    constructor(
        protected chatService: ChatService,
    ) {
        super('wlc-chat-header');
    }

    public closeChatHandler(): void {
        this.chatService.closeChat();
    }

}
