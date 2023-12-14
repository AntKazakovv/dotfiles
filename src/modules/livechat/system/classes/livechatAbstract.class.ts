import {
    Directive,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    Transition,
    UIRouter,
} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import _includes from 'lodash-es/includes';

import {
    EventService,
    DeviceModel,
    ActionService,
    DeviceType,
} from 'wlc-engine/modules/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';

export enum ChatState {
    loaded,
    opened,
    minimized,
    hidden,
    started,
    ended,
}

@Directive()
export abstract class LivechatAbstract<T extends ILivechatConfig>  {
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

    protected options: T = this.configService.get<T>('$base.livechat');
    protected isMobile: boolean = this.configService.get<DeviceModel>('device').isMobile;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        protected eventService: EventService,
        protected router: UIRouter,
        protected configService: ConfigService,
        protected actionService: ActionService,
    ) {}

    /**
     * Main method to init chat service
     */
    public init(): void {
        this.initChat();
        this.initEvents();
        this.initSubscribes();
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

    public  abstract chatIsLoaded(): boolean;

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

    protected reloadChat(): void {}

    /**
     * Chat open, close, toggle events subscriptions
     */
    protected initEvents(): void {
        this.eventService.filter({name: 'LIVECHAT_TOGGLE'}).subscribe(() => this.toggleChat());
        this.eventService.filter({name: 'LIVECHAT_OPEN'}).subscribe(() => this.openChat());
        this.eventService.filter({name: 'LIVECHAT_CLOSE'}).subscribe(() => this.hideChat());
    }

    protected initSubscribes(): void {
        this.subscribeTransitionStates();

        if (this.options.excludeOnlyMobile) {
            this.actionService.deviceType()
                .subscribe((type: DeviceType) => {
                    this.isMobile = type !== DeviceType.Desktop;
                    this.checkCurrentState(this.router.globals.current.name);
                });
        }
    }

    /**
     *
     * Checks whether the target state is included in excludeStates
     * @returns {boolean} boolean
     */
    protected get isExcludeStates(): boolean {
        return _includes(this.options.excludeStates, this.router.globals.current.name);
    }

    /**
     * Check target transition state
     */
    protected subscribeTransitionStates(): void {
        this.router.transitionService.onSuccess({}, (transition: Transition) => {
            const stateName: string = transition.targetState().name();
            this.checkCurrentState(stateName);
        });
    }

    /**
     * check current state and close chat, if it's excludeStates in config
    */
    protected checkCurrentState(stateName: string): void {

        if (_includes(this.options.excludeStates, stateName)
            && ((this.options.excludeOnlyMobile && this.isMobile)
                || !this.options.excludeOnlyMobile)
        ) {
            this.destroyChat(this.options.type);
            return;
        }

        if (!this.chatIsLoaded()) {
            this.initChat();
            if (!this.options.hidden && this.options.type === 'zendesk') {
                this.showWidget();
            }
            return;
        }
        if (this.options.type === 'verbox') {
            this.rerunWidget();
        }
        if (this.options.type === 'chatra') {
            this.showWidget();
        }
    }

    protected destroyChat(type: string): void {
        switch (type) {
            case 'chatra':
                this.hideChat();
                break;
            default:
                this.destroyWidget();
                break;
        }
    }
}
