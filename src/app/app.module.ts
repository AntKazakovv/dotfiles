import { MatSliderModule } from '@angular/material/slider';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { WlcBaseModule } from './modules/base/base.module';
import { WlcCoreModule } from './modules/core/core.module';
import { WlcMessagesModule } from './modules/messages/messages.module';
import { WlcSeoModule } from './modules/seo/seo.module';
import { WlcSmsModule } from './modules/sms/sms.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    WlcBaseModule,
    WlcCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
