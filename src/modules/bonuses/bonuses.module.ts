import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {BonusesService} from './system/services';

import {BonusItemComponent} from './components/bonus-item/bonus-item.component';
import {BonusesListComponent} from './components/bonuses-list/bonuses-list.component';
import {EnterPromocodeComponent} from './components/enter-promocode/enter-promocode.component';
import {SeeAllBonusesComponent} from './components/see-all-bonuses/see-all-bonuses.component';

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-list': BonusesListComponent,
    'wlc-enter-promocode': EnterPromocodeComponent,
    'wlc-see-all-bonuses': SeeAllBonusesComponent,
};

@NgModule({
    declarations: [
        BonusItemComponent,
        BonusesListComponent,
        EnterPromocodeComponent,
        SeeAllBonusesComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
    ],
    providers: [
        BonusesService,
    ],
    exports: [
        BonusItemComponent,
        BonusesListComponent,
        EnterPromocodeComponent,
    ],
})

export class BonusesModule {
}
