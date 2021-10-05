import {DOCUMENT} from '@angular/common';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    OnDestroy,
    Renderer2,
} from '@angular/core';
import {
    first,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    CommonChatService,
    ChatState,
} from 'wlc-engine/modules/livechat';

import * as Params from './livechat-button.params';

@Component({
    selector: '[wlc-livechat-button]',
    templateUrl: './livechat-button.component.html',
    styleUrls: ['./styles/livechat-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LivechatButtonComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILivechatButtonCParams;

    public $params: Params.ILivechatButtonCParams;
    /** Hides button if chat is unavailable */
    public unavailable: boolean = false;
    /** Hides button if chat is hide */
    public chatIsHide: boolean;

    /** Styles element for hiding  */
    protected styles: HTMLElement;
    protected stylesId: string = 'livechat-styles';
    protected isChatStateWatch: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILivechatButtonCParams,
        @Inject(DOCUMENT) private document: Document,
        protected configService: ConfigService,
        protected chatService: CommonChatService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.chatService.config.type) {

            if (this.chatService.config.showOnlyAuth) {
                this.chatService.chatIsHide$
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((value) => {
                        this.chatIsHide = value;
                        this.cdr.markForCheck();
                        if (!value) {
                            this.hideDefaultButton();
                        }
                    });
            }

            this.init();
        } else {
            this.unavailable = true;
            this.cdr.markForCheck();
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.$params.replaceDefault && !this.chatIsHide) {
            if (this.styles) {
                this.cancelForceHideWidgetButton();
            }

            if (!this.unavailable) {
                this.chatService.activeChatService.showWidget();
            }
        }
    }

    /**
     * Button click handler
    */
    public handleClick(): void {
        this.eventService.emit({name: 'LIVECHAT_OPEN'});
    }

    protected init(): void {
        if (!this.chatService.chatIsInited) {
            this.eventService
                .filter({name: 'LOGIN'})
                .pipe(
                    takeUntil(this.$destroy),
                    first(),
                )
                .subscribe(() => {
                    this.init();
                });

            return;
        }

        this.addModifiers(this.chatService.config.type);

        if (this.$params.replaceDefault && !this.chatIsHide) {
            this.hideDefaultButton();
        }
    }

    protected hideDefaultButton(): void {
        if (this.chatService.activeChatService.forceHideStyles) {
            this.forceHideWidgetButton();
        } else if (this.chatService.activeChatService.chatState$) {
            if (this.chatService.activeChatService.chatIsLoaded()) {
                this.chatService.activeChatService.hideWidget();
            }

            if (!this.isChatStateWatch) {
                this.isChatStateWatch = true;

                this.chatService.activeChatService.chatState$
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((state: ChatState) => {
                        if (state === ChatState.minimized || state === ChatState.loaded) {
                            this.chatService.activeChatService.hideWidget();
                        }
                    });
            }
        }
    }

    protected forceHideWidgetButton(): void {
        if (this.styles) {
            return;
        }

        if (this.document.getElementById(this.stylesId)) {
            this.styles = this.document.getElementById(this.stylesId);
            return;
        }

        this.styles = this.document.createElement('style');
        this.renderer.setAttribute(this.styles, 'id', this.stylesId);
        this.styles.innerHTML = this.chatService.activeChatService.forceHideStyles;
        this.renderer.appendChild(this.document.body, this.styles);
    }

    protected cancelForceHideWidgetButton(): void {
        this.renderer.removeChild(this.document.body, this.styles);
        this.styles = null;
    }

}
