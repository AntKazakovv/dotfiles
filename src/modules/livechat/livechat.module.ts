import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../core/core.module';

import {ChatraService} from './system/services/chatra/chatra.service';
import {LivechatincService} from './system/services/livechatinc/livechatinc.service';
import {VerboxService} from './system/services/verbox/verbox.service';
import {TawkChatService} from './system/services/tawk/tawk-chat.service';
import {CommonChatService} from './system/services/common/common-chat.service';
import {ZendeskService} from './system/services/zendesk/zendesk.service';

import {LivechatButtonComponent} from './components/livechat-button/livechat-button.component';

export const components = {
    'wlc-livechat-button': LivechatButtonComponent,
};

export const services = {
    'common-chat-service': CommonChatService,
};

@NgModule({
    declarations: [
        LivechatButtonComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
    ],
    providers: [
        ChatraService,
        LivechatincService,
        VerboxService,
        TawkChatService,
        CommonChatService,
        ZendeskService,
    ],
    exports: [],
})

export class LivechatModule {
}
