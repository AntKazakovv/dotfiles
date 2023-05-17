import {
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
    AbstractControl,
} from '@angular/forms';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';

import {
    takeUntil,
    BehaviorSubject,
    map,
    fromEvent,
    filter,
} from 'rxjs';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {XMPPAdapterService} from 'wlc-engine/modules/chat/system/services/xmpp-adapter.service';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {
    ChatService,
    TConnectionStatus,
} from 'wlc-engine/modules/chat/system/services/chat.service';

@Component({
    selector: '[wlc-send-form]',
    templateUrl: './send-form.component.html',
    styleUrls: ['./send-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendFormComponent extends AbstractChatComponent implements OnInit {
    @ViewChild('message', {static: true}) protected textarea: ElementRef<HTMLTextAreaElement>;

    public form: UntypedFormGroup = new UntypedFormGroup({
        message: new UntypedFormControl(null, [
            Validators.maxLength(160),
        ]),
    });
    public emojiPanelState$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    protected isConnected: boolean = false;
    protected cursorPosition: number = 0;

    constructor(
        public tas: TempAdapterService,
        protected chatService: ChatService,
        protected chatListService: ChatListService,
        protected cdr: ChangeDetectorRef,
        protected xmppService: XMPPAdapterService,
        protected elementRef: ElementRef,
    ) {
        super('wlc-send-form');
    }

    public ngOnInit(): void {
        this.form.disable();

        this.chatService.connectChat$.pipe(
            map((status: TConnectionStatus) => status === 'connected'),
            takeUntil(this.destroy$),
        ).subscribe((isConnected: boolean) => {
            if (isConnected) {
                this.form.enable();
            } else {
                this.form.disable();
            }
            this.switchMod('state-connected', isConnected);
            this.switchMod('state-connecting', !isConnected);
            this.cdr.markForCheck();
        });

        this.keyPressSubscription();
    }

    public get nickname(): string {
        return this.chatService.currentNickname;
    }

    public changeNickname(): void {
        this.chatService.addLoginAction();
    }

    public submitHandler(): void {
        if (this.form.valid && this.form.controls.message.value?.trim()) {
            this.form.disable();

            this.chatService.sendMsgToRoom(this.form.controls['message'].value)
                .pipe(takeUntil(this.destroy$))
                .subscribe((isSent: boolean) => {
                    if (isSent) {
                        this.form.controls['message'].setValue(null);
                    }

                    this.form.enable();
                    this.textarea.nativeElement.focus();
                    this.cdr.markForCheck();
                });

            if (this.emojiPanelState$.getValue()) {
                this.emojiPanelState$.next(false);
            }
        }
    }

    public toggleEmojiPanel(): void {
        this.emojiPanelState$.next(!this.emojiPanelState$.getValue());
    }

    public addEmoji(emoji: string): void {
        const messageControl: AbstractControl = this.form.controls['message'];
        const msg: string = messageControl.value;
        const newMsg: string = msg ? msg.slice(0, this.cursorPosition) + emoji + msg.slice(this.cursorPosition) : emoji;

        messageControl.setValue(newMsg);
        this.cursorPosition += emoji.length;
    }

    public saveCursorPosition($event: FocusEvent): void {
        this.cursorPosition = ($event.target as HTMLTextAreaElement).selectionStart;
    }

    protected keyPressSubscription(): void {
        fromEvent(this.elementRef.nativeElement, 'keypress').pipe(
            filter((event: KeyboardEvent) => event.key === 'Enter' && !event.shiftKey),
            takeUntil(this.destroy$),
        ).subscribe((event: KeyboardEvent) => {
            event.preventDefault();
            this.submitHandler();
        });
    }
}
