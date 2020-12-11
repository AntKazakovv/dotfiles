import {CommonModule} from '@angular/common';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AngularResizedEventModule} from 'angular-resize-event';

import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UIRouterModule, UIView} from '@uirouter/angular';
import {APP_STATES} from '../core/system/config/app.states';
import {routerConfigFn} from '../core/system/config/router.config';
import {HttpLoaderFactory, MissingTranslationService} from '../core/system/config/translate.loader';

import {environment} from '../../system/environments/environment';
import {AppComponent} from './components/app/app.component';
import {CoreModule} from '../core/core.module';
import {ConfigService} from '../core/system/services';
import {Location} from '@angular/common';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {NgxWebstorageModule} from 'ngx-webstorage';
import * as Sentry from '@sentry/angular';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ActionService} from 'wlc-engine/modules/core/system/services';

export function loadConfig(config: ConfigService) {
    return config.load();
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule.withServerTransition({appId: 'wlc-app'}),
        BrowserTransferStateModule,
        AngularResizedEventModule,
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
        NgxWebstorageModule.forRoot(),
        ServiceWorkerModule.register('/static/dist/ngsw-worker.js', {enabled: environment.production}), // environment.production
        ModalModule.forRoot(),
    ],
    providers: [
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: (config: ConfigService) => () => config.load(),
            deps: [ConfigService],
            multi: true,
        },
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                logErrors: true,
            }),
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

    public initialPath: IIndexing<string>;

    constructor(
        location: Location,
        protected actionService: ActionService,
    ) {
        this.parseInitPath(location.path());
    }

    protected parseInitPath(path: string): void {
        if (path.includes('message')) {
            this.initialPath = {};
            const values: string[] = path.split('?')[1].split('&');
            for (const value of values) {
                const parts: string[] = value.split('=');
                this.initialPath[parts[0]] = parts[1];
            }
            this.actionService.processMessages(this.initialPath);
        }
    }
}
