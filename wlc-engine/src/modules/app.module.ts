import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {AppComponent} from './base/app/app.component';
import {APP_STATES} from '../config/app.states';
import {routerConfigFn} from '../config/router.config';
import {UIRouterModule, UIView} from '@uirouter/angular';

import {HttpClientModule, HttpClient} from '@angular/common/http';

import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

import {HttpLoaderFactory, MissingTranslationService} from '../config/translate.loader';

import {CoreModule} from './core/core.module';
import {BaseModule} from './base/base.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({appId: 'wlc-server-app'}),
    BrowserTransferStateModule,
    HttpClientModule,
    UIRouterModule.forRoot({
      states: APP_STATES,
      useHash: false,
      config: routerConfigFn,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationService,
      },
    }),
    CoreModule,
  ],
  exports: [
    CoreModule,
  ],
  bootstrap: [UIView]
})
export class AppModule {}
