import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import {
    BehaviorSubject,
    EMPTY,
    switchMap,
    tap,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';
import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
import {TUseAsNickname} from 'wlc-engine/modules/chat/system/config/chat.config';

export type TFooterType = 'notAuth' | 'auth' | 'noLogin' | 'banned' | 'kicked' | 'offline' | 'connecting';
@Component({
    selector: '[wlc-chat-footer]',
    templateUrl: './chat-footer.component.html',
    styleUrls: ['./chat-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatFooterComponent extends AbstractChatComponent implements OnInit {
    public author!: string;
    public reason!: string;
    public footerType$: BehaviorSubject<TFooterType> = new BehaviorSubject(
        this.tas.isAuth$.getValue() ? 'auth' : 'notAuth');

    protected auth$ = this.tas.isAuth$.pipe(switchMap((isAuth: boolean) => {
        const type: TFooterType = isAuth ? this.nickname ? 'auth' : 'noLogin' : 'notAuth';

        this.footerType$.next(type);
        return isAuth ? this.chatService.userChangedStream$ : EMPTY;
    }), tap((data) => this.changeStatusCallback(data)));

    public readonly nicknameType: TUseAsNickname = this.tas.nicknameType;

    constructor(
        protected tas: TempAdapterService,
        protected chatService: ChatService,
        protected cdr: ChangeDetectorRef,
    ) {
        super('wlc-chat-footer');
    }

    public ngOnInit(): void {
        this.chatService.connectChat$.pipe(
            switchMap((v => {
                if (!v) {
                    this.footerType$.next('connecting');
                }
                return v ? this.auth$ : EMPTY;
            })),
            takeUntil(this.destroy$),
        ).subscribe();
    }

    public get nickname(): string {
        return this.chatService.currentNickname;
    }

    public connectRoom(): void {
        this.chatService.connectRoom();
    }

    public loginHandler(): void {
        this.chatService.signInAction();
    }

    public addLoginHandler(): void {
        this.chatService.addLoginAction();
    }

    protected changeStatusCallback(data: any): void {
        this.author = data?.author;
        this.reason = data?.reason?.[0];

        let type: TFooterType = this.nickname ? 'auth' : 'noLogin';

        if (this.chatService.selfContact.role === 'visitor') {
            type = 'banned';
        }

        if (this.chatService.selfContact.status === 'unavailable') {
            type = 'kicked';
        }

        if (data?.server === 'failed') {
            type = 'offline';
        }

        if (this.footerType$.getValue() !== type) {
            this.footerType$.next(type);
        }

        this.cdr.markForCheck();
    }
}
