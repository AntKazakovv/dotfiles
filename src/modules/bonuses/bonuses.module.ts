import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BonusesService} from './system/services';
import {CoreModule} from '../core/core.module';
import {BonusItemComponent} from './components/bonus-item/bonus-item.component';
import {BonusesListComponent} from './components/bonuses-list/bonuses-list.component';
import {TranslateModule} from '@ngx-translate/core';

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-list': BonusesListComponent,
};

@NgModule({
    declarations: [
        BonusItemComponent,
        BonusesListComponent,
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
    ],
})

export class BonusesModule { }
