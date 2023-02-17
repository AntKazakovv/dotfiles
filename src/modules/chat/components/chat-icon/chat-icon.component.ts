import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    OnDestroy,
} from '@angular/core';

import {
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';

import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';

@Component({
    selector: '[wlc-chat-icon]',
    templateUrl: './chat-icon.component.html',
    styleUrls: ['./styles/chat-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatIconComponent implements OnInit, OnDestroy {
    @HostBinding('class.wlc-chat-icon') public $class = 'wlc-chat-icon';

    protected destroy$: Subject<void> = new Subject();

    constructor(
        protected chatService: ChatService,
        protected chatListService: ChatListService,
        protected cdr: ChangeDetectorRef,
    ) {}

    public ngOnInit(): void {
        this.chatListService.messages$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.chatListService.countUnread();
                this.cdr.markForCheck();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

}
