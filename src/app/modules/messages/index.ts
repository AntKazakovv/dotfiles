import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MessagesService} from './services/messages/messages.service';

import {ItemComponent} from './components/item/item.component';
import {ListComponent} from './components/list/list.component';
import {NotifyComponent} from './components/notify/notify.component';
import {PushControlComponent} from './components/push-control/push-control.component';

@NgModule({
    declarations: [
        ItemComponent,
        ListComponent,
        NotifyComponent,
        PushControlComponent
    ],
    providers: [
        MessagesService
    ],
    exports: [
        ItemComponent,
        ListComponent,
        NotifyComponent,
        PushControlComponent
    ],
    imports: [
        CommonModule
    ]
})
export class WlcMessagesModule {
}
