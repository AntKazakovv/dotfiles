import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {CurrencyService} from 'wlc-engine/modules/currency/system/services/currency.service';

export const services = {
    'currency-service': CurrencyService,
};

@NgModule({
    imports: [CoreModule],
    declarations: [],
    providers: [CurrencyService],
    exports: [],
})
export class CurrencyModule {}
