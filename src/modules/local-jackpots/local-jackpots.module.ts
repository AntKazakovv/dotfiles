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
import {CoreModule} from 'wlc-engine/modules/core/core.module';

export const components = {
    'wlc-local-jackpot': LocalJackpotComponent,
    'wlc-jackpot-banner': JackpotBannerComponent,
};

export const services = {
    'local-jackpots-service': LocalJackpotsService,
};

@NgModule({
    declarations: [
        LocalJackpotComponent,
        JackpotBannerComponent,
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
    ],
})
export class LocalJackpotsModule {
}
