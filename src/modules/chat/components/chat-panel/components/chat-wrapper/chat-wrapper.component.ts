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
    EMPTY,
    combineLatest,
    timer,
} from 'rxjs';
import {
    filter,
    debounceTime,
    map,
    switchMap,
    distinctUntilChanged,
} from 'rxjs/operators';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';
import {
    Direction,
    IMessage,
    INewMsg,
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
    public buffer$: BehaviorSubject<INewMsg[]> = new BehaviorSubject([]);

    protected start: number = 0;
    protected end: number = this.chatListService.messages.length;
    protected renderLimit: number = 30;
    protected renderGap: number = 10;

    constructor(
        protected elRef: ElementRef,
        protected chatService: ChatService,
        protected chatListService: ChatListService,
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
                if (this.chatListService.messages.length) {
                    this.updateBuffer(false, false, true);
                }
                this.cdr.markForCheck();
            });

        this.chatService.connectChat$
            .pipe(
                filter((status) => status === 'connected'),
                takeUntil(this.destroy$),
            )
            .subscribe((): void => {
                this.chatConnected = true;
                this.cdr.markForCheck();
                this.scrollToEnd(true);
            });

        combineLatest([
            this.chatService.isChatOpenedObserver$,
            this.chatService.tabVisibility$,
        ]).pipe(
            map(([chatVisibility, tabVisibility]): boolean => chatVisibility && tabVisibility),
            distinctUntilChanged((prev, curr) => {
                if (prev != curr && curr) {
                    this.updateBuffer(this.scrollUp);
                }
                return false;
            }),
            switchMap((visible: boolean) => visible ? this.chatListService.messages$ : EMPTY),
            takeUntil(this.destroy$),
        ).subscribe((message: IMessage) => {

            if (message.type === 'retract') {
                this.updateBuffer(true, true, true);

            } else if (message.type === 'replace') {
                this.updateBuffer(false, false, true);
            } else {

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
                debounceTime(100),
                takeUntil(this.destroy$),
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

        timer(0).pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.scrollContainer.nativeElement.scrollTo({
                    top: this.scrollContainer.nativeElement.scrollHeight,
                    left: 0,
                    behavior: 'smooth',
                });
            });

    }

    public trackByFn(index: number, msg: INewMsg): string {
        return msg.id;
    }

    public intersectingHandler(isIntersecting: boolean, msg: INewMsg): void {
        this.markAsRead(isIntersecting, msg);

        if (isIntersecting && msg) {
            this.updateBuffer(this.scrollUp, true);
        }
    }

    /** Sets property `read: true` for message in viewport */
    protected markAsRead(isIntersecting: boolean, msg: INewMsg): void {
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
    protected updateBuffer(up: boolean, newMsg: boolean = false, updateList?: boolean): void {
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

        if (updateList || oldStart !== this.start || oldEnd !== this.end) {
            this.buffer$.next(
                this.chatListService.messages.slice(this.start - this.end),
            );
        }
    }
}
