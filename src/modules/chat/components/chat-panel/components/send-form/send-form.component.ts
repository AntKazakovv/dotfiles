import {DOCUMENT} from '@angular/common';
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
    Inject,
} from '@angular/core';

import {
    takeUntil,
    BehaviorSubject,
    map,
    fromEvent,
    filter,
} from 'rxjs';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {
    XMPPAdapterService,
    TMessageErrors,
} from 'wlc-engine/modules/chat/system/services/xmpp-adapter.service';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
import {ChatListService} from 'wlc-engine/modules/chat/system/services/chat-list.service';
import {
    ChatService,
    TConnectionStatus,
} from 'wlc-engine/modules/chat/system/services/chat.service';
import {
    TTooltipState,
} from 'wlc-engine/modules/chat/components/chat-panel/components/chat-tooltip/chat-tooltip.component';
import {ChatConfigService} from 'wlc-engine/modules/chat/system/services/chat-config.service';

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
    public errorText$:  BehaviorSubject<string> = new BehaviorSubject(null);
    public tooltipState$: BehaviorSubject<TTooltipState> = new BehaviorSubject(null);
    public tooltipTimer: number = this.config.base.errorTimer;

    protected isConnected: boolean = false;
    protected cursorPosition: number = 0;

    constructor(
        public tas: TempAdapterService,
        @Inject(DOCUMENT) protected document: Document,
        protected chatService: ChatService,
        protected chatListService: ChatListService,
        protected cdr: ChangeDetectorRef,
        protected xmppService: XMPPAdapterService,
        protected elementRef: ElementRef,
        private config: ChatConfigService,
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

        this.xmppService.errorText$.pipe(
            takeUntil(this.destroy$),
        ).subscribe((text: string) => {
            this.tooltipToggle(text);

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
            this.form.disable();

            if (this.linksCheck(this.form.controls['message'].value)) {
                this.xmppService.errorTypeHandler('link');
                this.form.enable();
            } else {
                this.chatService.sendMsgToRoom(this.form.controls['message'].value)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((status: boolean | TMessageErrors) => {

                        if (status === true) {
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

    protected tooltipToggle(text: string): void {
        this.errorText$.next(text);
        this.tooltipState$.next('opened');
    }

    protected linksCheck(message: string): boolean {
        const pattern: RegExp = new RegExp(/(https?:\/\/)|(?:www\.)?/.source
            + /[\w#%\+.:=@~-]{2,256}\.[\d()A-Za-z]{2,6}\b/.source
            + /[\w#%&()\+.\/:=?@~-]*/.source);
        return pattern.test(message);
    }
}
