import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterPipe } from './modules/base/pipes/filter/filter.pipe';
import { PhoneVerifyComponent } from './modules/sms/components/phone-verify/phone-verify.component';
import { ListComponent } from './modules/messages/components/list/list.component';
import { ItemComponent } from './modules/messages/components/item/item.component';
import { NotifyComponent } from './modules/messages/components/notify/notify.component';
import { PushControlComponent } from './modules/messages/components/push-control/push-control.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    PhoneVerifyComponent,
    ListComponent,
    ItemComponent,
    NotifyComponent,
    PushControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
