import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../core/core.module';

import {ChatraService} from './system/services/chatra/chatra.service';
import {LivechatincService} from './system/services/livechatinc/livechatinc.service';
import {VerboxService} from './system/services/verbox/verbox.service';
import {CommonChatService} from './system/services/common/common-chat.service';

export const components = {};

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CoreModule,
    ],
    providers: [
        ChatraService,
        LivechatincService,
        VerboxService,
        CommonChatService,
    ],
    exports: [],
})

export class LivechatModule {
}
