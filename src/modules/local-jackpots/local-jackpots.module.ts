import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TranslateModule} from '@ngx-translate/core';
import {CountUpModule} from 'ngx-countup';

import {
    LocalJackpotsService,
} from './system/services';
import {
    LocalJackpotComponent,
} from 'wlc-engine/modules/local-jackpots/components/local-jackpot/local-jackpot.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

export const components = {
    'wlc-local-jackpot': LocalJackpotComponent,
};

export const services = {
    'local-jackpots-service': LocalJackpotsService,
};

@NgModule({
    declarations: [
        LocalJackpotComponent,
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
    ],
})
export class LocalJackpotsModule {
}
