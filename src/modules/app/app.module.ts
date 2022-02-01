import {CommonModule} from '@angular/common';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
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
import {
    ConfigService,
    EventService,
    ActionService,
    LogService,
} from 'wlc-engine/modules/core/system/services';
import {Location} from '@angular/common';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {ModalModule} from 'ngx-bootstrap/modal';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system/tokens/window';

export function loadConfig(config: ConfigService) {
    return config.load();
}

export class GlobalDeps {
    public static logService: LogService;
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
            otherwise: (matchValue, url, rt) => {
                const locale = rt?.globals.params.locale
                    || url.path.split('/')[1]
                    || 'en';

                return {
                    state: 'app.error',
                    params:{locale},
                };
            },
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
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        ModalModule.forRoot(),
    ],
    providers: [
        WINDOW_PROVIDER,
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
    public initialPath: IIndexing<string>;
    private errorTimeoutId: number;

    constructor(
        location: Location,
        protected actionService: ActionService,
        private eventService: EventService,
        private logService: LogService,
    ) {
        this.parseInitPath(location.path());
        GlobalDeps.logService = this.logService;
        this.eventService.subscribe({
            name: 'ERROR_PAGE_ENTER',
        }, (data: number) => {
            this.errorTimeoutId = data;
        });

        this.eventService.subscribe({
            name: 'ERROR_PAGE_LEAVE',
        }, () => {
            if (this.errorTimeoutId) {
                clearTimeout(this.errorTimeoutId);
                this.errorTimeoutId = null;
            }
        });

    }

    protected parseInitPath(path: string): void {
        if (path.includes('message') || path.includes('error')) {
            this.initialPath = {};
            const values: string[] = path.split('?')?.[1]?.split('&') || [];

            if (values.length) {
                for (const value of values) {
                    const parts: string[] = value.split('=');
                    this.initialPath[parts[0]] = parts[1];
                }

                this.actionService.processMessages(this.initialPath);
            }
        }
    }
}
