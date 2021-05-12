import {Injectable} from '@angular/core';
import {ConfigService} from 'wlc-engine/modules/core';
import {
    ChatraService,
    ILivechatConfig,
    LivechatincService,
    VerboxService,
} from 'wlc-engine/modules/livechat';

@Injectable({
    providedIn: 'root',
})
export class CommonChatService {

    constructor(
        protected configService: ConfigService,
        protected livechatincService: LivechatincService,
        protected verboxService: VerboxService,
        protected chatraService: ChatraService,
    ) {
        this.init();
    }

    protected init(): void {
        const config = this.configService.get<ILivechatConfig>('$base.livechat');
        switch (config?.type) {
            case 'chatra':
                this.chatraService.init();
                break;
            case 'livechatinc':
                this.livechatincService.init();
                break;
            case 'verbox':
                this.verboxService.init();
                break;
        }
    }
}
