import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoModule} from './logo/logo.module';
import {RootModule} from './root/root.module';
import {LanguageModule} from './language/language.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LogoModule,
    LanguageModule,
    RootModule,
  ]
})
export class CoreModule {}
