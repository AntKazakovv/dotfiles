import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { MatSliderModule } from '@angular/material/slider';

import {
  WlcCoreModule,
  WlcMessagesModule,
  WlcSeoModule,
  WlcSmsModule
} from './modules';

import {AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    WlcCoreModule,
    WlcMessagesModule,
    WlcSeoModule,
    WlcSmsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
