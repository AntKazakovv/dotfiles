import {DOCUMENT} from '@angular/common';
import {
    Component,
    OnInit,
    Inject,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import {Subject} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {DeadsimplechatService} from 'wlc-engine/modules/deadsimplechat/system/services/deadsimplechat.service';

import * as Params from './deadsimplechat.params';

@Component({
    selector: '[wlc-deadsimplechat]',
    templateUrl: './deadsimplechat.component.html',
    styleUrls: ['./styles/deadsimplechat.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadsimplechatComponent extends AbstractComponent implements OnInit {
    @Input() protected iconPath: string;

    public ready$: Subject<boolean> = new Subject();
    public override $params: Params.IDeadsimplechatCParams;
    public zIndexLiveChat: string = '';
    public roomId: string;
    public liveChatExist: boolean = false;
    public iframeSrc: string;
    public isChatOpen: boolean = false;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject('injectParams') protected params: Params.IDeadsimplechatCParams,
        protected deadsimplechatService: DeadsimplechatService,
        configService: ConfigService,
        protected eventService: EventService,
        protected translate: TranslateService,
    ) {
        super(<IMixedParams<Params.IDeadsimplechatCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    public init(): void {
        this.liveChatExist = this.configService.get<boolean>('$base.livechat');
        this.eventService.subscribe({name: 'CHAT_USER_RESPONSE'}, () => {
            this.ready$.next(true);
            this.roomId = this.$params.common.roomId || this.deadsimplechatService.chatRoom.roomId;
            this.iframeSrc =
            `https://deadsimplechat.com/${this.roomId}?username=${this.deadsimplechatService.userResponse.username}`;
        }, this.$destroy);

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.ready$.next(false);
        });
    }

    public closeChat(): void {
        this.isChatOpen = false;

        this.document.getElementById('chat-wrapper').style.right = '-360px';
        this.document.getElementById('chat-wrapper').style.top = '';
        this.document.getElementById('chat-wrapper').style.left = '';

        if (this.liveChatExist) {
            this.document.getElementById('chat-widget-container').style.zIndex = this.zIndexLiveChat;
        }
    }

    public openChat(): void {
        this.isChatOpen = true;

        this.document.getElementById('chat-wrapper').style.right = '6px';

        if (this.liveChatExist) {
            this.zIndexLiveChat = this.document.getElementById('chat-widget-container')?.style.zIndex;
            this.document.getElementById('chat-widget-container').style.zIndex = '0';
        }
    }
}
