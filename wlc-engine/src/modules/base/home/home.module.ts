import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';

import {LogoComponent} from '../logo/logo.component';
import {LanguageSelectorComponent} from '../language-selector/language-selector.component';

import {
  TranslateModule,
} from '@ngx-translate/core';

@NgModule({
  declarations: [HomeComponent, LogoComponent, LanguageSelectorComponent],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    TranslateModule,
  ]
})
export class HomeModule {}
