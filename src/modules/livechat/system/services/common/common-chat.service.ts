import {
    Injectable,
    Injector,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {ChatraService} from 'wlc-engine/modules/livechat/system/services/chatra/chatra.service';
import {LivechatincService} from 'wlc-engine/modules/livechat/system/services/livechatinc/livechatinc.service';
import {VerboxService} from 'wlc-engine/modules/livechat/system/services/verbox/verbox.service';
import {TawkChatService} from 'wlc-engine/modules/livechat/system/services/tawk/tawk-chat.service';
import {ZendeskService} from 'wlc-engine/modules/livechat/system/services/zendesk/zendesk.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

export type TChatService = LivechatincService | VerboxService | ChatraService | TawkChatService | ZendeskService;

@Injectable({
    providedIn: 'root',
})
export class CommonChatService {

    public chatIsInited: boolean = false;
    public activeChatService: TChatService;
    public config: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');
    public isAuth: boolean = this.configService.get<boolean>('$user.isAuthenticated');
    public chatIsHide$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        protected configService: ConfigService,
        protected injector: Injector,
        protected eventService: EventService,
    ) {
        this.init();
    }

    protected init(): void {
        switch (this.config?.type) {
            case 'chatra':
                this.activeChatService = this.injector.get(ChatraService);
                break;
            case 'livechatinc':
                this.activeChatService = this.injector.get(LivechatincService);
                break;
            case 'verbox':
                this.activeChatService = this.injector.get(VerboxService);
                break;
            case 'tawkChat':
                this.activeChatService = this.injector.get(TawkChatService);
                break;
            case 'zendesk':
                this.activeChatService = this.injector.get(ZendeskService);
                break;
            default: return;
        }

        if (this.config.showOnlyAuth) {
            this.setHandlers();

            if (!this.isAuth) {
                return;
            }
        }

        this.initChat();
    }

    protected setHandlers(): void {
        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.isAuth = false;
            this.activeChatService.destroyWidget();
            this.chatIsHide$.next(true);
        });

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.isAuth = true;

            if (this.chatIsInited) {
                this.activeChatService.rerunWidget();
            } else {
                this.initChat();
            }

            this.chatIsHide$.next(false);
        });
    }

    protected initChat(): void {
        if (this.activeChatService) {
            this.activeChatService.init();
            this.chatIsInited = true;
        } else {
            console.error(`Unavailable chat type: ${this.config.type}`);
        }
    }
}
