import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {UIView} from '@uirouter/angular';

import {MissingTranslationService} from '../core/system/config/translate.loader';
import {serverTranslateFactory} from '../core/system/config/server-translate.loader';

import {
    TranslateModule,
    TranslateLoader,
    MissingTranslationHandler,
} from '@ngx-translate/core';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ServerTransferStateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: serverTranslateFactory,
                deps: [],
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: MissingTranslationService,
            },
        }),
    ],
    bootstrap: [UIView],
})
export class AppServerModule {
}
