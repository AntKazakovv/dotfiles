import {
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    OnDestroy,
} from '@angular/core';

import {
    AbstractComponent,
    LogService,
    ConfigService,
} from 'wlc-engine/modules/core';

import {
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';

import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';

import * as Params from './chat-icon.params';

@Component({
    selector: '[wlc-chat-icon]',
    templateUrl: './chat-icon.component.html',
    styleUrls: ['./styles/chat-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatIconComponent extends AbstractComponent implements OnInit, OnDestroy {
    @HostBinding('class.wlc-chat-icon') public override $class: string = 'wlc-chat-icon';
    protected destroy$: Subject<void> = new Subject();

    public override $params: Params.IChatIconCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IChatIconCParams,
        protected chatService: ChatService,
        protected chatListService: ChatListService,
        cdr: ChangeDetectorRef,
        protected logService: LogService,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.chatListService.messages$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.chatListService.countUnread();
                this.cdr.markForCheck();
            });
    }

    public override ngOnDestroy(): void {
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
