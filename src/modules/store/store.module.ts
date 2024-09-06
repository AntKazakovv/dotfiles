import {NgModule} from '@angular/core';

import _get from 'lodash-es/get';

import {CoreModule} from '../core/core.module';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {CompilerModule} from 'wlc-engine/modules/compiler/compiler.module';

import {StoreService} from './system/services';

import {StoreItemComponent} from './components/store-item/store-item.component';
import {StoreListComponent} from './components/store-list/store-list.component';
import {StoreTitleComponent} from './components/store-title/store-title.component';
import {StoreItemInfoComponent} from './components/store-item-info/store-item-info.component';
import {StoreConfirmationComponent} from './components/store-confirmation/store-confirmation.component';
import {StoreItemPriceComponent} from 'wlc-engine/modules/store/components/store-item-price/store-item-price.component';
import {StoreFilterFormComponent} from './components/store-filter-form/store-filter-form.component';
import {IStoreModule} from './system/interfaces/store.interface';
import {storeConfig} from './system/config/store.config';

import * as $config from 'wlc-config/index';

export const components = {
    'wlc-store-item': StoreItemComponent,
    'wlc-store-list': StoreListComponent,
    'wlc-store-title': StoreTitleComponent,
    'wlc-store-item-info': StoreItemInfoComponent,
    'wlc-store-confirmation': StoreConfirmationComponent,
    'wlc-store-item-price': StoreItemPriceComponent,
    'wlc-store-filter-form': StoreFilterFormComponent,
};

export const services = {
    'store-service': StoreService,
};

export const moduleConfig = GlobalHelper.mergeConfig<IStoreModule>(storeConfig, _get($config, '$store', {}));

@NgModule({
    declarations: [
        StoreItemComponent,
        StoreListComponent,
        StoreTitleComponent,
        StoreItemInfoComponent,
        StoreConfirmationComponent,
        StoreItemPriceComponent,
        StoreFilterFormComponent,
    ],
    imports: [
        CoreModule,
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
        StoreFilterFormComponent,
    ],
})

export class StoreModule {
}
