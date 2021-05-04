import {EventService} from 'wlc-engine/modules/core';

export abstract class LivechatAbstract {
    public chatId: string;
    public chatIsOpen: boolean = false;

    constructor(
        protected document: HTMLDocument,
        protected eventService: EventService,
    ) {
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
     * Chat open, close, toggle events subscribtions
     */
    public initEvents(): void {
        this.eventService.filter({name: 'LIVECHAT_TOGGLE'}).subscribe(() => this.toggleChat());
        this.eventService.filter({name: 'LIVECHAT_OPEN'}).subscribe(() => this.openChat());
        this.eventService.filter({name: 'LIVECHAT_CLOSE'}).subscribe(() => this.hideChat());
    }
}
