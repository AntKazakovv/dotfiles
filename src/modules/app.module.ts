import {CommonModule} from '@angular/common';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';

import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UIRouterModule, UIView} from '@uirouter/angular';
import {APP_STATES} from '../config/app.states';
import {routerConfigFn} from '../config/router.config';

import {HttpLoaderFactory, MissingTranslationService} from '../config/translate.loader';
import {environment} from '../environments/environment';
import {AppComponent} from '../app/app.component';

import {CoreModule} from './core/core.module';
import {ConfigService} from './core/services';
import {PromoModule} from 'wlc-engine/modules/promo/promo.module';

export function loadConfig(config: ConfigService) {
    return config.load();
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule.withServerTransition({appId: 'wlc-app'}),
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
        PromoModule,
        ServiceWorkerModule.register('/static/dist/ngsw-worker.js', {enabled: environment.production}), // environment.production
    ],
    providers: [
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: (config: ConfigService) => () => config.load(),
            deps: [ConfigService],
            multi: true,
        },
    ],
    exports: [
        CoreModule,
        TranslateModule,
        UIRouterModule,
    ],
    bootstrap: [UIView],
})
export class AppModule {
}
