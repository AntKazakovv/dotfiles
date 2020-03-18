import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';

import {APP_STATES} from 'config/states';

import {MatSliderModule} from '@angular/material/slider';

import {
  WlcCoreModule,
  WlcMessagesModule,
  WlcSeoModule,
  WlcSmsModule
} from './modules';

import {AppComponent} from './app.component';
import {AppLayoutComponent} from './modules/pages/layouts/app-layout/app-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatSliderModule,
    WlcCoreModule,
    WlcMessagesModule,
    WlcSeoModule,
    WlcSmsModule,
    UIRouterModule.forRoot({states: APP_STATES})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
