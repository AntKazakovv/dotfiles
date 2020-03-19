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

import {AppComponent} from './modules/core/base/components/app/app.component';
import {AppLayoutComponent} from './modules/pages/layouts/app-layout/app-layout.component';
import {LogoComponent} from './modules/core/base/components/logo/logo.component';
import {APP_CONFIG} from 'tokens';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    LogoComponent
  ],
  imports: [
    UIRouterModule.forRoot({states: APP_STATES}),
    CommonModule,
    BrowserModule,
    MatSliderModule,
    WlcCoreModule,
    WlcMessagesModule,
    WlcSeoModule,
    WlcSmsModule,
  ],
  providers: [
      {
          provide: APP_CONFIG,
          useValue: {}
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
