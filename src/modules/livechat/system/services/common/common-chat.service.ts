import {Injectable} from '@angular/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {ChatraService} from 'wlc-engine/modules/livechat/system/services/chatra/chatra.service';
import {LivechatincService} from 'wlc-engine/modules/livechat/system/services/livechatinc/livechatinc.service';
import {VerboxService} from 'wlc-engine/modules/livechat/system/services/verbox/verbox.service';
import {TawkChatService} from 'wlc-engine/modules/livechat/system/services/tawk/tawk-chat.service';
import {TLiveChat} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';

export type TChatService = LivechatincService | VerboxService | ChatraService | TawkChatService;

@Injectable({
    providedIn: 'root',
})
export class CommonChatService {

    public chatType: TLiveChat;
    public activeChatService: TChatService;

    constructor(
        protected configService: ConfigService,
        protected livechatincService: LivechatincService,
        protected verboxService: VerboxService,
        protected chatraService: ChatraService,
        protected tawkChatService: TawkChatService,
    ) {
        this.init();
    }

    protected init(): void {
        const config = this.configService.get<ILivechatConfig>('$base.livechat');

        if (config?.type) {
            this.chatType = config.type;

            switch (config.type) {
                case 'chatra':
                    this.activeChatService = this.chatraService;
                    break;
                case 'livechatinc':
                    this.activeChatService = this.livechatincService;
                    break;
                case 'verbox':
                    this.activeChatService = this.verboxService;
                    break;
                case 'tawkChat':
                    this.activeChatService = this.tawkChatService;
                    break;
            }

            if (this.activeChatService) {
                this.activeChatService.init();
            } else {
                console.error(`Unavailable chat type: ${config.type}`);
            }
        }
    }
}
