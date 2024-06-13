import {DOCUMENT} from '@angular/common';
import {
    Component,
    OnInit,
    Inject,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

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
    public iframeSrc: string;
    protected isWindowOpen: boolean = false;
    protected zIndexLiveChat: string = '';
    protected roomId: string;
    protected liveChatExist: boolean = false;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject('injectParams') protected params: Params.IDeadsimplechatCParams,
        protected deadsimplechatService: DeadsimplechatService,
        configService: ConfigService,
        protected eventService: EventService,
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

    protected toggleChat(): void {
        this.isWindowOpen = !this.isWindowOpen;

        if (this.isWindowOpen
            && this.liveChatExist
            && this.document.getElementById('chat-widget-container'))
        {
            this.zIndexLiveChat = this.document.getElementById('chat-widget-container')?.style.zIndex;
            this.document.getElementById('chat-widget-container').style.zIndex = '0';
        } else if (this.liveChatExist && this.document.getElementById('chat-widget-container')) {
            this.document.getElementById('chat-widget-container').style.zIndex = this.zIndexLiveChat;
        }
    }
}
