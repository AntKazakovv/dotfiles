import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LanguageSelectorComponent} from './language-selector/language-selector.component';

export {LanguageSelectorComponent} from './language-selector/language-selector.component';
import {UIRouterModule} from '@uirouter/angular';

@NgModule({
  declarations: [LanguageSelectorComponent],
  imports: [
    CommonModule,
    UIRouterModule
  ],
  exports: [
    LanguageSelectorComponent
  ]
})
export class LanguageModule {}
