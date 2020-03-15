import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
