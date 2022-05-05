import {Directive} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {EventService} from 'wlc-engine/modules/core';

export enum ChatState {
    loaded,
    opened,
    minimized,
    hidden,
    started,
    ended,
}

@Directive()
export abstract class LivechatAbstract {
    public chatId: string;
    public chatIsOpen: boolean = false;
    /**
     * Must be used if chat supports events.
     *
     * Left it undefined if chat doesn't support events.
     */
    public chatState$: BehaviorSubject<ChatState>;
    /**
     * If chat doesn't support events, this styles are be used to hide widget button.
     *
     * Left it undefined if chat supports events
     */
    public forceHideStyles: string;
    /**
     * true - if chat have destroy api and dont call hideWidget() in destroyWidget() method
     */
    public abstract canChatDestroy: boolean;

    constructor(
        protected document: HTMLDocument,
        protected eventService: EventService,
    ) {}

    /**
     * Main method to init chat service
     */
    public init(): void {
        this.initChat();
        this.initEvents();
    }

    /**
     * Open chat abstract method
     */
    public abstract openChat(): void;

    /**
     * Close chat abstract method
     */
    public abstract hideChat(): void;


    /**
     * Destroy chat widget
     */
    public abstract destroyWidget(): void;

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public abstract rerunWidget(): void;

    /**
     * Hides chat widget button
     */
    public hideWidget(): void {};

    /**
     * Shows hidden chats widget button
     */
    public showWidget(): void {};

    /**
     * Toggle chat method
     */
    public toggleChat(): void {
        if (this.chatId) {
            const chatEl = this.document.getElementById(this.chatId);
            if (chatEl) {
                if (this.chatIsOpen) {
                    this.hideChat();
                } else {
                    this.openChat();
                }
                this.chatIsOpen = !this.chatIsOpen;
            }
        }
    }

    /**
     * Must contains code to init chat.
     */
    protected initChat(): void {}

    /**
     * Chat open, close, toggle events subscriptions
     */
    protected initEvents(): void {
        this.eventService.filter({name: 'LIVECHAT_TOGGLE'}).subscribe(() => this.toggleChat());
        this.eventService.filter({name: 'LIVECHAT_OPEN'}).subscribe(() => this.openChat());
        this.eventService.filter({name: 'LIVECHAT_CLOSE'}).subscribe(() => this.hideChat());
    }
}
