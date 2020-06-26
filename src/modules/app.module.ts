import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {AppComponent} from './base/app/app.component';
import {APP_STATES} from '../config/app.states';
import {routerConfigFn} from '../config/router.config';
import {UIRouterModule, UIView} from '@uirouter/angular';
import {APP_INITIALIZER} from '@angular/core';

import {HttpClientModule, HttpClient} from '@angular/common/http';

import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

import {HttpLoaderFactory, MissingTranslationService} from '../config/translate.loader';

import {CoreModule} from './core/core.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ConfigService} from './core/services';

export function loadConfig(config: ConfigService) {
  return config.load();
}

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
    ServiceWorkerModule.register('/static/dist/ngsw-worker.js', {enabled: environment.production}), // environment.production
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => {
        return config.load();
      },
      deps: [ConfigService],
      multi: true
    }
  ],
  exports: [
    CoreModule,
    TranslateModule,
    UIRouterModule,
  ],
  bootstrap: [UIView]
})
export class AppModule {}
