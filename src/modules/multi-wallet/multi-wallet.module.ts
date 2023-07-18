import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {WalletsComponent} from './components/wallets/wallets.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';
import {SearchFieldComponent} from 'wlc-engine/modules/multi-wallet/components/search-field/search-field.component';

export const components = {
    'wlc-wallets': WalletsComponent,
};
export const services = {
    'wallet-service': WalletsService,
};

@NgModule({
    declarations: [
        WalletsComponent,
        SearchFieldComponent,
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
    ],
})

export class MultiWalletModule {
}
