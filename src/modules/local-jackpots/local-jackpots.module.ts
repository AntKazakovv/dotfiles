import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TranslateModule} from '@ngx-translate/core';
import {CountUpModule} from 'ngx-countup';

import {
    LocalJackpotsService,
} from './system/services';
import {
    JackpotBannerComponent,
    LocalJackpotComponent,
} from 'wlc-engine/modules/local-jackpots';
import {JackpotWonComponent} from 'wlc-engine/modules/local-jackpots/components/jackpot-won/jackpot-won.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

export const components = {
    'wlc-local-jackpots': LocalJackpotComponent,
    'wlc-jackpot-banner': JackpotBannerComponent,
    'wlc-jackpot-won': JackpotWonComponent,
};

export const services = {
    'local-jackpots-service': LocalJackpotsService,
};

@NgModule({
    declarations: [
        LocalJackpotComponent,
        JackpotBannerComponent,
        JackpotWonComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
        CountUpModule,
    ],
    providers: [
        LocalJackpotsService,
    ],
    exports: [
        LocalJackpotComponent,
        JackpotBannerComponent,
        JackpotWonComponent,
    ],
})
export class LocalJackpotsModule {
}
