import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';

import {StoreService} from './system/services';

import {StoreItemComponent} from './components/store-item/store-item.component';
import {StoreListComponent} from './components/store-list/store-list.component';
import {StoreTitleComponent} from './components/store-title/store-title.component';
import {StoreItemInfoComponent} from './components/store-item-info/store-item-info.component';

export const components = {
    'wlc-store-item': StoreItemComponent,
    'wlc-store-list': StoreListComponent,
    'wlc-store-title': StoreTitleComponent,
    'wlc-store-item-info': StoreItemInfoComponent,
};

export const services = {
    'store-service': StoreService,
};

@NgModule({
    declarations: [
        StoreItemComponent,
        StoreListComponent,
        StoreTitleComponent,
        StoreItemInfoComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
    ],
    providers: [
        StoreService,
    ],
    exports: [
        StoreItemComponent,
        StoreListComponent,
        StoreTitleComponent,
        StoreItemInfoComponent,
    ],
})

export class StoreModule {
}
