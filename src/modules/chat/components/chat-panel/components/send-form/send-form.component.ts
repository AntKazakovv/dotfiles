import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
} from '@angular/forms';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnInit,
} from '@angular/core';

import {
    takeUntil,
    BehaviorSubject,
    map,
} from 'rxjs';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {XMPPAdapterService} from 'wlc-engine/modules/chat/system/services/xmpp-adapter.service';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {
    ChatService,
    TConnectionStatus,
} from 'wlc-engine/modules/chat/system/services/chat.service';
import {Direction} from 'wlc-engine/modules/chat/system/interfaces';

@Component({
    selector: '[wlc-send-form]',
    templateUrl: './send-form.component.html',
    styleUrls: ['./send-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendFormComponent extends AbstractChatComponent implements OnInit {

    public form: FormGroup = new FormGroup({
        message: new FormControl(null, [
            Validators.maxLength(160),
        ]),
        isFake: new FormControl(false),
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
            takeUntil(this.destroy$),
            map((status: TConnectionStatus) => status === 'connected'),
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
    }

    public get nickname(): string {
        return this.chatService.currentNickname;
    }

    public changeNickname(): void {
        this.chatService.addLoginAction();
    }

    public submitHandler(): void {
        if (this.form.valid && this.form.controls.message.value?.trim()) {
            if (this.form.controls['isFake'].value)  {
                this.chatListService.addMessage({
                    direction: Direction.out,
                    body: this.form.controls['message'].value,
                    datetime: new Date(),
                    from: {
                        nickname: this.chatService.currentNickname,
                        affiliation: 'none',
                        role: 'faker',
                        jid: this.xmppService.userJid,
                    },
                });
            } else {
                this.chatService.sendMsgToRoom(this.form.controls['message'].value);
            }
            this.form.controls['message'].setValue(null);

            if (this.emojiPanelState$.getValue()) {
                this.emojiPanelState$.next(false);
            }
        }
    }

    @HostListener('keypress', ['$event'])
    public keypressHandler(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.submitHandler();
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
}
