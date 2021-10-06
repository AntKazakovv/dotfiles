import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';
import {
    Inject,
    Injectable,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {
    EventService,
    ConfigService,
    LogService,
} from 'wlc-engine/modules/core';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {
    ChatState,
    LivechatAbstract,
} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';

@Injectable({providedIn: 'root'})
export class ZendeskService extends LivechatAbstract {

    protected options: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');

    constructor(
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private translateService: TranslateService,
    ) {
        super(document, eventService);
    }

    /**
     * Check if chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return !!window.zE && window.zEACLoaded;
    }

    /**
     * Open chat window method
     */
    public openChat(): void {
        try {
            window.zE('webWidget', 'show');
            window.zE('webWidget', 'open');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Show hidden chat widget
     */
    public showWidget(): void {
        try {
            window.zE('webWidget', 'show');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Close chat window
     */
    public hideChat(): void {
        try {
            window.zE('webWidget', 'close');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Hide chat widget
     */
    public hideWidget(): void {
        try {
            window.zE('webWidget', 'hide');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * when we have showOnlyAuth in livechatConfig, init chat widget in login
     */
    public rerunWidget():void {
        this.showWidget();
    }

    /**
     * Destroy chat widget
     */
    public destroyWidget():void {
        this.hideWidget();
    }

    /**
     * Toggle chat window
     */
    public toggleChat(): void {
        try {
            window.zE('webWidget', 'toggle');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    protected initChat(): void {
        this.chatState$ = new BehaviorSubject(null);

        if (this.options.type !== 'zendesk' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && window.WLC_ENV) {
            return;
        }

        const script = this.document.createElement('script');
        script.async = true;
        script.id = 'ze-snippet';
        script.src = 'https://static.zdassets.com/ekr/snippet.js?key=' + this.options.code;

        window.zESettings = this.options.zESettings || {};

        script.onload = () => {
            window.zE('webWidget:on', 'chat:connected', () => {
                this.chatState$.next(ChatState.loaded);
                window.zE(
                    'webWidget',
                    'setLocale',
                    this.translateService.currentLang || 'en',
                );
            });

            window.zE('webWidget:on', 'chat:start', () => {
                this.chatState$.next(ChatState.started);
            });

            window.zE('webWidget:on', 'chat:end', () => {
                this.chatState$.next(ChatState.ended);
            });

            window.zE('webWidget:on', 'close', () => {
                this.chatState$.next(ChatState.minimized);
            });

            window.zE('webWidget:on', 'open', () => {
                this.chatState$.next(ChatState.opened);
            });

            this.setHandlers();
        };

        this.document.head.appendChild(script);
    }

    protected setHandlers(): void {
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            window.zE(
                'webWidget',
                'setLocale',
                event.lang,
            );
        });
    }
}
