import { MatSliderModule } from '@angular/material/slider';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhoneVerifyComponent } from './modules/sms/components/phone-verify/phone-verify.component';
import { ListComponent } from './modules/messages/components/list/list.component';
import { ItemComponent } from './modules/messages/components/item/item.component';
import { NotifyComponent } from './modules/messages/components/notify/notify.component';
import { PushControlComponent } from './modules/messages/components/push-control/push-control.component';

import {WlcBaseModule} from './modules/base/base.module';

@NgModule({
  declarations: [
    AppComponent,
    PhoneVerifyComponent,
    ListComponent,
    ItemComponent,
    NotifyComponent,
    PushControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    WlcBaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
