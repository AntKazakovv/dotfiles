import {CommonModule} from '@angular/common';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';

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
    ActionService,
    LogService,
    IData,
} from 'wlc-engine/modules/core/system/services';
import {Location} from '@angular/common';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {ModalModule} from 'ngx-bootstrap/modal';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system/tokens/window';

export function loadConfig(config: ConfigService): Promise<IData> | Promise<unknown> {
    return config.load();
}

export class GlobalDeps {
    public static logService: LogService;
    public static configService: ConfigService;
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule.withServerTransition({appId: 'wlc-app'}),
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
                    params: {locale},
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
            useFactory: (config: ConfigService) => () => void config.load(),
            deps: [ConfigService],
            multi: true,
        },
    ],
    exports: [
        CoreModule,
        UIRouterModule,
        TranslateModule,
    ],
    bootstrap: [UIView],
})
export class AppModule {
    public initialPath: IIndexing<string>;

    constructor(
        location: Location,
        protected actionService: ActionService,
        private logService: LogService,
        private configService: ConfigService,
    ) {
        GlobalDeps.logService = this.logService;
        GlobalDeps.configService = this.configService;
        this.parseInitPath(location.path());
    }

    protected parseInitPath(path: string): void {
        const queryParams: string[] = this.configService.get('queryParams');

        if (queryParams.some(parameter => path.includes(parameter))) {
            this.initialPath = {};
            const values: string[] = path.split('?')?.[1]?.split('&') || [];
            if (values.length) {
                for (const value of values) {
                    const parts: string[] = value.split('=');
                    this.initialPath[parts[0]] = parts[1];
                }

                if (this.initialPath.hasOwnProperty('praxis_transaction_status')) {
                    this.checkPraxisTransactionStatus();
                };

                if (path.includes('utm_')) {
                    this.configService.set({name: 'utm', value: path.slice(path.indexOf('?'), path.length)});
                }

                this.actionService.processMessages(this.initialPath);
            }
        }
    }

    protected checkPraxisTransactionStatus(): void {
        switch (this.initialPath['praxis_transaction_status']) {
            case 'initialized':
            case 'pending':
            case 'authorized':
                this.initialPath['message'] = 'PAYMENT_PENDING';
                break;
            case 'approved':
                this.initialPath['message'] = 'PAYMENT_SUCCESS';
                break;
            case 'rejected':
            case 'cancelled':
            case 'error':
                this.initialPath['message'] = 'PAYMENT_FAIL';
                break;
            case 'partial_refund':
            case 'refund':
                this.initialPath['message'] = '';
                break;
        }
    }
}
