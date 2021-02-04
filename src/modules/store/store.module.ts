import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {BonusesModule} from '../bonuses/bonuses.module';
import {UserModule} from '../user/user.module';

import {StoreService} from './system/services';

import {StoreItemComponent} from './components/store-item/store-item.component';
import {StoreListComponent} from './components/store-list/store-list.component';

export const components = {
    'wlc-store-item': StoreItemComponent,
    'wlc-store-list': StoreListComponent,
};

@NgModule({
    declarations: [
        StoreItemComponent,
        StoreListComponent,
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
    ],
})

export class StoreModule {
}
