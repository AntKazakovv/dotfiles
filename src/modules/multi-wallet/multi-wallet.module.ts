import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {WalletsComponent} from './components/wallets/wallets.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';
import {SearchFieldComponent} from 'wlc-engine/modules/multi-wallet/components/search-field/search-field.component';
import {SettingsComponent} from './components/settings/settings.component';
import {FiltersComponent} from './components/filters/filters.component';
import {ChoiceCurrencyComponent} from './components/choice-currency/choice-currency.component';

export const components = {
    'wlc-wallets': WalletsComponent,
    'wlc-settings': SettingsComponent,
    'wlc-filters': FiltersComponent,
    'wlc-choice-currency': ChoiceCurrencyComponent,
};
export const services = {
    'wallet-service': WalletsService,
};

@NgModule({
    declarations: [
        WalletsComponent,
        SearchFieldComponent,
        SettingsComponent,
        FiltersComponent,
        ChoiceCurrencyComponent,
    ],

    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        TranslateModule,
    ],
    providers: [
        WalletsService,
    ],
    exports: [
        WalletsComponent,
        SettingsComponent,
        FiltersComponent,
        ChoiceCurrencyComponent,
    ],
})

export class MultiWalletModule {
}
