import {
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    OnDestroy,
} from '@angular/core';

import {
    Observable,
    takeUntil,
} from 'rxjs';

import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';
import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';

export type TChatIconTheme = 'default' | 'wolf';
export type TChatIconType = 'default' | 'sticky-footer';
export interface IChatIconParams {
    type?: TChatIconType;
    theme?: TChatIconTheme;
};

@Component({
    selector: '[wlc-chat-icon]',
    templateUrl: './chat-icon.component.html',
    styleUrls: ['./styles/chat-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatIconComponent extends AbstractChatComponent implements OnInit, OnDestroy {

    constructor(
        @Inject('injectParams') protected params: IChatIconParams,
        protected chatService: ChatService,
        protected chatListService: ChatListService,
        protected cdr: ChangeDetectorRef,
    ) {
        super('wlc-chat-icon');
    }

    public ngOnInit(): void {
        this.prepareParams();
        this.chatListService.messages$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.chatListService.countUnread();
                this.cdr.markForCheck();
            });
    }

    public get unread$(): Observable<number> {
        return this.chatListService.unreadCounter$;
    }

    public get unread(): number {
        return this.chatListService.unreadCounter;
    }

    public clickHandler(): void {
        if (this.chatService.isChatOpened) {
            this.chatService.closeChat();
        } else {
            this.chatService.openChat();
        }
    }

    protected prepareParams(): void {
        if (this.params.type) {
            this.addMod(`type-${this.params.type}`);
        } else {
            this.params.type = 'default';
        }
        this.addMod(this.prepareTheme());
    }

    protected prepareTheme(): string {
        return this.params.theme ? `theme-${this.params.theme}` : 'theme-default';
    }
}
