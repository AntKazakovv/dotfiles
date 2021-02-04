import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {PromoModule} from '../promo/promo.module';
import {UserModule} from '../user/user.module';
import {BonusesService} from './system/services';

import {BonusItemComponent} from './components/bonus-item/bonus-item.component';
import {BonusesListComponent} from './components/bonuses-list/bonuses-list.component';
import {EnterPromocodeComponent} from './components/enter-promocode/enter-promocode.component';
import {PromoSuccessComponent} from './components/promo-success/promo-success.component';

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-list': BonusesListComponent,
    'wlc-enter-promocode': EnterPromocodeComponent,
    'wlc-promo-success': PromoSuccessComponent,
};

@NgModule({
    declarations: [
        BonusItemComponent,
        BonusesListComponent,
        EnterPromocodeComponent,
        PromoSuccessComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        PromoModule,
        TranslateModule,
        UserModule,
    ],
    providers: [
        BonusesService,
    ],
    exports: [
        BonusItemComponent,
        BonusesListComponent,
        EnterPromocodeComponent,
        PromoSuccessComponent,
    ],
})

export class BonusesModule {
}
