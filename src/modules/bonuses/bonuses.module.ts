import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoyaltyBonusesService} from './services/loyalty-bonuses.service';
import {CoreModule} from '../core/core.module';

export const components = {

};

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CoreModule,
    ],
    providers: [
        LoyaltyBonusesService,
    ],
})

export class BonusesModule { }
