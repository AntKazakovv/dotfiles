import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinancesService} from './services/finances.service';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

export const components = {
};

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
    ],
    declarations: [],
    providers: [
        FinancesService,
    ],
})
export class FinancesModule {
}
