import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {CompilerModule} from 'wlc-engine/modules/compiler/compiler.module';

import {StoreService} from './system/services';

import {StoreItemComponent} from './components/store-item/store-item.component';
import {StoreListComponent} from './components/store-list/store-list.component';
import {StoreTitleComponent} from './components/store-title/store-title.component';
import {StoreItemInfoComponent} from './components/store-item-info/store-item-info.component';
import {StoreConfirmationComponent} from './components/store-confirmation/store-confirmation.component';
import {StoreItemPriceComponent} from 'wlc-engine/modules/store/components/store-item-price/store-item-price.component';

export const components = {
    'wlc-store-item': StoreItemComponent,
    'wlc-store-list': StoreListComponent,
    'wlc-store-title': StoreTitleComponent,
    'wlc-store-item-info': StoreItemInfoComponent,
    'wlc-store-confirmation': StoreConfirmationComponent,
    'wlc-store-item-price': StoreItemPriceComponent,
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
        StoreConfirmationComponent,
        StoreItemPriceComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
        CompilerModule,
    ],
    providers: [
        StoreService,
    ],
    exports: [
        StoreItemComponent,
        StoreListComponent,
        StoreTitleComponent,
        StoreItemInfoComponent,
        StoreConfirmationComponent,
        StoreItemPriceComponent,
    ],
})

export class StoreModule {
}
