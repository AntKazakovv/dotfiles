import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

// -- SERVICES IMPORTS START --;
import {LimitationService} from './system/services/limitation/limitation.service';
import {LicenseLimitationsService} from './system/services/license-limitations/license-limitations.service';
// -- SERVICES IMPORTS END  --;

// -- COMPONENTS IMPORTS  --;
import {LimitationsComponent} from './components/limitations/limitations.component';
import {LimitCancelComponent} from './components/limit-cancel/limit-cancel.component';
import {LimitValueComponent} from './components/limit-value/limit-value.component';
// -- COMPONENTS IMPORTS END  --;

export const components = {
    'wlc-limitations': LimitationsComponent,
};

export const services = {
    'limitation-service': LimitationService,
    'license-limitations-service': LicenseLimitationsService,
};

@NgModule({
    declarations: [
        LimitationsComponent,
        LimitCancelComponent,
        LimitValueComponent,
    ],
    imports: [
        CoreModule,
        TranslateModule,
    ],
    providers: [
        LimitationService,
        LicenseLimitationsService,
    ],
    exports: [
        LimitationsComponent,
    ],
})
export class LimitationsModule {
}
