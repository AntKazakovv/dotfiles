import {DOCUMENT} from '@angular/common';
import {
    Component,
    OnInit,
    Inject,
    Renderer2,
    Input,
} from '@angular/core';

import {
    Subject,
    asyncScheduler,
} from 'rxjs';
import {
    takeUntil,
    throttleTime,
    first,
} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {DeadsimplechatService} from 'wlc-engine/modules/deadsimplechat/system/services/deadsimplechat.service';

import * as Params from './deadsimplechat.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-deadsimplechat]',
    templateUrl: './deadsimplechat.component.html',
    styleUrls: ['./styles/deadsimplechat.component.scss'],
})
export class DeadsimplechatComponent extends AbstractComponent implements OnInit {
    @Input() protected iconPath: string;

    public ready$: Subject<boolean> = new Subject();
    public override $params: Params.IDeadsimplechatCParams;
    public zIndexLiveChat: string = '';
    public roomId: string;
    public liveChatExist: boolean = false;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject('injectParams') protected params: Params.IDeadsimplechatCParams,
        protected deadsimplechatService: DeadsimplechatService,
        configService: ConfigService,
        protected eventService: EventService,
        protected renderer: Renderer2,
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

    public init() {
        this.liveChatExist = this.configService.get<boolean>('$base.livechat');
        this.eventService.subscribe({name: 'CHAT_USER_RESPONSE'}, () => {
            this.ready$.next(true);
            const iframe: HTMLIFrameElement = this.document.createElement('iframe');
            this.roomId = this.$params.common.roomId || this.deadsimplechatService.chatRoom.roomId;
            // eslint-disable-next-line max-len
            iframe.src = `https://deadsimplechat.com/${this.roomId}?username=${this.deadsimplechatService.userResponse.username}`;
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            GlobalHelper.createMutationObserver(
                document.body,
                {
                    childList: true,
                    subtree: true,
                })
                .pipe(
                    first(),
                    throttleTime(600, asyncScheduler, {trailing: true}),
                    takeUntil(this.$destroy),
                )
                .subscribe(() => {
                    const container: Element = document.querySelector('.wlc-deadsimplechat-wrapper__body');
                    if (container) {
                        this.renderer.appendChild(container, iframe);
                    }
                });
        }, this.$destroy);

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.ready$.next(false);
        });
    }

    public closeChat(): void {
        this.document.getElementById('chat-wrapper').style.right = '-360px';
        this.document.getElementById('chat-wrapper').style.top = '';
        this.document.getElementById('chat-wrapper').style.left = '';

        if (this.liveChatExist) {
            this.document.getElementById('chat-widget-container').style.zIndex = this.zIndexLiveChat;
        }
    }

    public openChat(): void {
        this.document.getElementById('chat-wrapper').style.right = '6px';

        if (this.liveChatExist) {
            this.zIndexLiveChat = this.document.getElementById('chat-widget-container')?.style.zIndex;
            this.document.getElementById('chat-widget-container').style.zIndex = '0';
        }
    }
}
