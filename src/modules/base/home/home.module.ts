import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';

import {HomeComponent} from './home.component';
import {BaseModule} from '../base.module';

import {
  TranslateModule,
} from '@ngx-translate/core';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    TranslateModule,
    UIRouterModule.forChild({states: [
      {
        name: 'app.home',
        views: {
          content: {
            component: HomeComponent
          }
        }
      }
    ]}),
    BaseModule,
  ],
  exports: [
    TranslateModule,
  ]
})
export class HomeModule {}
