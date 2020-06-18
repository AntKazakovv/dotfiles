import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';

import {CatalogComponent} from './catalog.component';
import {BaseModule} from '../base.module';

import {
  TranslateModule,
} from '@ngx-translate/core';

export const catalogRouterParams = {states: [
  {
    name: 'app.catalog',
    url: '/catalog',
    views: {
      content: {
        component: CatalogComponent,
      }
    }
  }
]};

@NgModule({
  declarations: [CatalogComponent],
  imports: [
    CommonModule,
    TranslateModule,
    UIRouterModule.forChild(catalogRouterParams),
    BaseModule,
  ],
  exports: [
    TranslateModule,
  ]
})
export class CatalogModule {}
