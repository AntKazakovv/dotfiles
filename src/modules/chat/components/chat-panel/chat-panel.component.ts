import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';

@Component({
    selector: '[wlc-chat-panel]',
    templateUrl: './chat-panel.component.html',
    styleUrls: ['./styles/chat-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPanelComponent extends AbstractChatComponent implements OnInit {

    constructor(
        @Inject('injectParams') protected params: string,
        protected chatService: ChatService,
        protected cdr: ChangeDetectorRef,
    ) {
        super('wlc-chat-panel');
    }

    public ngOnInit(): void {
        this.chatService.isChatOpenedObserver$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isOpened: boolean) => {
                this.switchMod('opened', isOpened);
                this.switchMod('closed', !isOpened);
                this.cdr.markForCheck();
            });
    }
}
