import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {BonusesModule} from '../bonuses/bonuses.module';
import {UserModule} from '../user/user.module';

import {StoreService} from './system/services';

import {StoreItemComponent} from './components/store-item/store-item.component';
import {StoreListComponent} from './components/store-list/store-list.component';
import {StoreTitleComponent} from './components/store-title/store-title.component';

export const components = {
    'wlc-store-item': StoreItemComponent,
    'wlc-store-list': StoreListComponent,
    'wlc-store-title': StoreTitleComponent,
};

export const services = {
    'store-service': StoreService,
};

@NgModule({
    declarations: [
        StoreItemComponent,
        StoreListComponent,
        StoreTitleComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        BonusesModule,
        TranslateModule,
        UserModule,
    ],
    providers: [
        StoreService,
    ],
    exports: [
        StoreItemComponent,
        StoreListComponent,
        StoreTitleComponent,
    ],
})

export class StoreModule {
}
