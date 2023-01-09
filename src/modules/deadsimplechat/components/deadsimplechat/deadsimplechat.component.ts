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
    fromEvent,
    asyncScheduler,
} from 'rxjs';
import {
    switchMap,
    takeUntil,
    map,
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

@Component({
    selector: '[wlc-deadsimplechat]',
    templateUrl: './deadsimplechat.component.html',
    styleUrls: ['./styles/deadsimplechat.component.scss'],
})
export class DeadsimplechatComponent extends AbstractComponent implements OnInit {
    @Input() protected iconPath: string;

    public ready$: Subject<boolean> = new Subject();
    public $params: Params.IDeadsimplechatCParams;
    public zIndexLiveChat: string = '';
    public roomId: string;
    public liveChatExist: boolean = false;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject('injectParams') protected params: Params.IDeadsimplechatCParams,
        protected deadsimplechatService: DeadsimplechatService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected renderer: Renderer2,
        protected translate: TranslateService,
    ) {
        super(<IMixedParams<Params.IDeadsimplechatCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
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
                        this.createDraggableChat();
                    }
                });
        }, this.$destroy);

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.ready$.next(false);
        });
    }

    public createDraggableChat() {
        const chatWrapper: HTMLElement = this.document.getElementById('chat-wrapper');

        const mousedown$ = fromEvent<MouseEvent>(chatWrapper, 'mousedown');
        const mousemove$ = fromEvent<MouseEvent>(this.document, 'mousemove');
        const mouseup$ = fromEvent<MouseEvent>(this.document, 'mouseup');

        const drag$ = mousedown$.pipe(
            switchMap(
                (start) => {
                    return mousemove$.pipe(map(move => {
                        move.preventDefault();
                        return {
                            left: move.clientX - start.offsetX,
                            top: move.clientY - start.offsetY,
                        };
                    }),
                    takeUntil(mouseup$));
                }));

        drag$.subscribe(pos => {
            chatWrapper.style.top = `${pos.top}px`;
            chatWrapper.style.left = `${pos.left}px`;
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
