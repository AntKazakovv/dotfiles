import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {UIRouter, Transition, StateDeclaration} from '@uirouter/core';
import {UIRouterModule, Ng2StateDeclaration} from '@uirouter/angular';

import {LayoutComponent} from '../layout/layout.component';
import {RootComponent} from './root.component';
import {LogoModule} from '../logo/logo.module';
import {LanguageModule, LanguageSelectorComponent} from '../language/language.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './static/languages/', '.json');
}

export function onStateEnter(trans: Transition, state: StateDeclaration) {
  const params = trans.params();
  if (!params.locale) {
      trans.abort();
      trans.router.stateService.go('app', {locale: 'en'});
  }
}

export const appState: Ng2StateDeclaration = {
  name: 'app',
  url: '/:locale',
  component: RootComponent,
  onEnter: onStateEnter,
};

// export const homeState: Ng2StateDeclaration = {
//   name: 'app.home',
//   url: '/home',
//   component: LanguageSelectorComponent
// };

export const APP_STATES = [
  appState,
  // homeState,
];

export function uiRouterConfigFn(router: UIRouter, injector: Injector) {
  router.urlService.rules.initial({state: 'app', params: {locale: 'en'}});
}

export class MissingTranslationService implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return params.key; // `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`;
  }
}

@NgModule({
  declarations: [RootComponent, LayoutComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    LogoModule,
    LanguageModule,
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
    UIRouterModule.forRoot({
      states: APP_STATES,
      useHash: false,
      config: uiRouterConfigFn,
    }),
  ],
  bootstrap: [LayoutComponent]
})
export class RootModule {}
