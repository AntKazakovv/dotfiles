import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {StaticModule} from 'wlc-engine/modules/static/static.module';

import {RatesCurrencyComponent} from 'wlc-engine/modules/rates/components/rates-currency/rates-currency.component';

export const components = {
    'wlc-rates-currency': RatesCurrencyComponent,
};

@NgModule({
    imports: [
        CoreModule,
        StaticModule,
    ],
    declarations: [
        RatesCurrencyComponent,
    ],
    providers: [],
    exports: [
        RatesCurrencyComponent,
    ],
})
export class RatesModule {}
