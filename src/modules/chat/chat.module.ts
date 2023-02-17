import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import _mergeWith from 'lodash-es/mergeWith';
import _get from 'lodash-es/get';

import {AlertComponent} from './components/chat-panel/components/alert/alert.component';
import {ButtonComponent} from './components/chat-panel/components/button/button.component';
import {ChatPanelComponent} from './components/chat-panel/chat-panel.component';
import {ChatIconComponent} from './components/chat-icon/chat-icon.component';
import {CloseBtnComponent} from './components/chat-panel/components/close-btn/close-btn.component';
import {RoomSelectorComponent} from './components/chat-panel/components/room-selector/room-selector.component';
import {ChatHeaderComponent} from './components/chat-panel/components/chat-header/chat-header.component';
import {ChatFooterComponent} from './components/chat-panel/components/chat-footer/chat-footer.component';
import {ChatWrapperComponent} from './components/chat-panel/components/chat-wrapper/chat-wrapper.component';
import {SendFormComponent} from './components/chat-panel/components/send-form/send-form.component';
import {MessageComponent} from './components/chat-panel/components/message/message.component';
import {DialogComponent} from './components/chat-panel/components/dialog/dialog.component';
import {NicknameFormComponent} from './components/chat-panel/components/nickname-form/nickname-form.component';
import {EmojiComponent} from './components/chat-panel/components/emoji/emoji.component';

import {IntersectionDirective} from './system/directives/intersection.directive';

import {ChatService} from './system/services/chat.service';
import {FakeService} from './system/services/fake.service';
import {ChatListService} from './system/services/chat-list.service';
import {DialogService} from './system/services/dialog.service';
import {TempAdapterService} from './system/services/temp-adapter.service';

import {MaxUnreadPipe} from './system/pipes/max-unread.pipe';
import {XMPPAdapterService} from 'wlc-engine/modules/chat/system/services/xmpp-adapter.service';
import {chatConfig, IChatConfig} from './system/config/chat.config';
import * as $config from 'wlc-config/index';
import {ChatConfigService} from 'wlc-engine/modules/chat/system/services/chat-config.service';

export const moduleConfig: IChatConfig = _mergeWith(
    chatConfig,
    {roomKeyPrefix: _get($config, '$base.site.name', '').toLowerCase()},
    _get($config, '$chat', {}),
    (objVal, srcVal) => {
        if (Array.isArray(objVal)) {return srcVal;}
    },
);

export const components = {
    'wlc-chat-icon': ChatIconComponent,
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        TranslateModule,
    ],
    declarations: [
        AlertComponent,
        ButtonComponent,
        ChatIconComponent,
        ChatPanelComponent,
        ChatWrapperComponent,
        ChatFooterComponent,
        ChatHeaderComponent,
        RoomSelectorComponent,
        CloseBtnComponent,
        SendFormComponent,
        MessageComponent,
        EmojiComponent,
        MaxUnreadPipe,
        DialogComponent,
        NicknameFormComponent,
        IntersectionDirective,
    ],
    providers: [
        ChatService,
        ChatListService,
        FakeService,
        DialogService,
        TempAdapterService,
        XMPPAdapterService,
        ChatConfigService,
    ],
    exports: [],
})
export class ChatModule {
}
