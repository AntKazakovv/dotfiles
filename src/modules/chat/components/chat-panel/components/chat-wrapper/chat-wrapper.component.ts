import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {
    takeUntil,
    Observable,
    BehaviorSubject,
    fromEvent,
} from 'rxjs';
import {
    filter,
    debounceTime,
} from 'rxjs/operators';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {FakeService} from 'wlc-engine/modules/chat/system/services/fake.service';
import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';
import {
    Direction,
    IMessage,
} from 'wlc-engine/modules/chat/system/interfaces';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
import {DOMEvent} from 'wlc-engine/modules/chat/system/interfaces';

@Component({
    selector: '[wlc-chat-wrapper]',
    templateUrl: './chat-wrapper.component.html',
    styleUrls: ['./chat-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWrapperComponent extends AbstractChatComponent implements OnInit {
    @ViewChild('scrollContainer', {static: true}) protected scrollContainer: ElementRef;

    public chatConnected: boolean = false;
    public skeletons: number[] = new Array(20);
    public buffer$: BehaviorSubject<IMessage[]> = new BehaviorSubject([]);

    protected start: number = 0;
    protected end: number = this.chatListService.messages.length;
    protected renderLimit: number = 30;
    protected renderGap: number = 10;

    constructor(
        protected elRef: ElementRef,
        protected chatService: ChatService,
        protected chatListService: ChatListService,
        protected fakeService: FakeService,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected tas: TempAdapterService,
    ) {
        super('wlc-chat-wrapper');
    }

    public ngOnInit(): void {
        this.chatService.activeRoomStr$
            .pipe(takeUntil(this.destroy$))
            .subscribe((): void => {
                this.chatConnected = false;
                this.buffer$.next([]);
                this.start = 0;
                this.end = this.chatListService.messages.length;
                this.cdr.markForCheck();
            });

        this.chatService.connectChat$
            .pipe(
                takeUntil(this.destroy$),
                filter(Boolean),
            )
            .subscribe((): void => {
                this.chatConnected = true;
                this.cdr.markForCheck();
                this.scrollToEnd(true);
            });

        this.chatListService.messages$
            .pipe(takeUntil(this.destroy$))
            .subscribe((message: IMessage): void => {
                if (this.chatService.isChatOpened) {
                    if (!this.chatConnected || !this.scrollUp) {
                        message.read = true;
                    }

                    if (message.direction === Direction.out || (!this.scrollUp))  {
                        message.read = true;
                        this.scrollToEnd();
                    } else {
                        this.updateBuffer(this.scrollUp, true);
                    }

                    if (this.chatConnected) {
                        this.chatListService.countUnread();
                    }
                }
            });

        let lastPos: number = 0;
        fromEvent(this.scrollContainer.nativeElement, 'scroll')
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100),
            )
            .subscribe((event: DOMEvent<HTMLDivElement>): void => {
                this.updateBuffer(lastPos > event.target.scrollTop);
                lastPos = event.target.scrollTop;
            });

    }

    /**
     * Unread messages observable
     */
    public get unread$(): Observable<number> {
        return this.chatListService.unreadCounter$;
    }

    /**
     * Calculate if scroll position is up direction
     */
    public get scrollUp(): boolean {
        const el: HTMLDivElement = this.scrollContainer.nativeElement;
        return (el.offsetHeight + el.scrollTop) < el.scrollHeight - 15;
    }

    /**
     * Scroll list of messages to end and update buffer
     * @param readAll define if need to mark all messages as read
     */
    public scrollToEnd(readAll: boolean = false): void {
        if (readAll) {
            this.chatListService.readAllMessages();
        }

        this.updateBuffer(false);

        setTimeout((): void => {
            this.scrollContainer.nativeElement.scrollTo({
                top: this.scrollContainer.nativeElement.scrollHeight,
                left: 0,
                behavior: 'smooth',
            });
        });

    }

    public trackByFn(index: number, msg: IMessage): string {
        return msg.id;
    }

    public intersectingHandler(isIntersecting: boolean, msg: IMessage): void {
        this.markAsRead(isIntersecting, msg);

        if (isIntersecting && msg) {
            this.updateBuffer(this.scrollUp, true);
        }
    }

    /** Sets property `read: true` for message in viewport */
    protected markAsRead(isIntersecting: boolean, msg: IMessage): void {
        if (isIntersecting && msg.read !== true) {
            msg.read = true;
            this.chatListService.countUnread();
        }
    }

    /**
     * Updates buffer
     * @param up - true if direction is up
     * @param newMsg - true if method called from message adding event
     */
    protected updateBuffer(up: boolean, newMsg: boolean = false): void {
        const oldStart: number = this.start, oldEnd: number = this.end;

        if (up) {
            if (this.end - this.start < this.renderLimit) {
                this.end = this.chatListService.messages.length;
            }
        } else {
            if (newMsg) {
                this.start = this.buffer$.getValue().length < this.renderLimit + this.renderGap
                    ? this.start : this.end - this.renderLimit;
                this.end = this.end + 1;
            } else {
                const firstUnread = this.chatListService.messages.findIndex((v) => !v.read);
                this.end = firstUnread == -1 ? this.chatListService.messages.length : firstUnread + this.renderGap + 1;
                this.start = this.end - this.renderLimit
                    + (this.start - this.end > this.renderLimit ? 1 : 0);
            }

            this.end = this.chatListService.messages.length;

            if (this.start - this.end > this.renderLimit) {
                this.start = this.end - this.renderLimit;
            }
        }

        this.start = this.start < 0 ? 0 : this.start;

        if (oldStart !== this.start || oldEnd !== this.end) {
            this.buffer$.next(
                this.chatListService.messages.slice(this.start - this.end),
            );
        }
    }
}
