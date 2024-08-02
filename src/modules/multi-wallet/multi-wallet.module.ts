import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {WalletsComponent} from './components/wallets/wallets.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';
import {SearchFieldComponent} from 'wlc-engine/modules/multi-wallet/components/search-field/search-field.component';
import {SettingsComponent} from './components/settings/settings.component';
import {FiltersComponent} from './components/filters/filters.component';
import {ChoiceCurrencyComponent} from './components/choice-currency/choice-currency.component';
import {WalletConfirmComponent} from './components/wallet-confirm/wallet-confirm.component';

export const components = {
    'wlc-wallets': WalletsComponent,
    'wlc-settings': SettingsComponent,
    'wlc-filters': FiltersComponent,
    'wlc-choice-currency': ChoiceCurrencyComponent,
    'wlc-wallet-confirm': WalletConfirmComponent,
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
        WalletConfirmComponent,
    ],

    imports: [
        CoreModule,
        FormsModule,
    ],
    providers: [
        WalletsService,
    ],
    exports: [
        WalletsComponent,
        SettingsComponent,
        FiltersComponent,
        ChoiceCurrencyComponent,
        WalletConfirmComponent,
    ],
})

export class MultiWalletModule {
}
