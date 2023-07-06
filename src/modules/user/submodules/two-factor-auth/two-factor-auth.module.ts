import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

// components
import {TwoFactorAuthInfoComponent} from './components/two-factor-auth-info/two-factor-auth-info.component';
import {TwoFactorAuthScanComponent} from './components/two-factor-auth-scan/two-factor-auth-scan.component';
import {TwoFactorAuthFinishComponent} from './components/two-factor-auth-finish/two-factor-auth-finish.component';
import {TwoFactorAuthCodeComponent} from './components/two-factor-auth-code/two-factor-auth-code.component';
import {TwoFactorAuthDisableComponent} from './components/two-factor-auth-disable/two-factor-auth-disable.component';
import {
    TwoFactorAuthProfileBlockComponent,
} from './components/two-factor-auth-profile-block/two-factor-auth-profile-block.component';

// services
import {TwoFactorAuthService} from './system/services/two-factor-auth/two-factor-auth.service';

export const components = {
    'wlc-two-factor-auth-info': TwoFactorAuthInfoComponent,
    'wlc-two-factor-auth-scan': TwoFactorAuthScanComponent,
    'wlc-two-factor-auth-finish': TwoFactorAuthFinishComponent,
    'wlc-two-factor-auth-code': TwoFactorAuthCodeComponent,
    'wlc-two-factor-auth-profile-block': TwoFactorAuthProfileBlockComponent,
    'wlc-two-factor-auth-disable': TwoFactorAuthDisableComponent,
};

export const services = {
    'two-factor-auth-service': TwoFactorAuthService,
};

@NgModule({
    imports: [
        CoreModule,
        TranslateModule,
    ],
    providers: [
        TwoFactorAuthService,
    ],
    declarations: [
        TwoFactorAuthInfoComponent,
        TwoFactorAuthScanComponent,
        TwoFactorAuthFinishComponent,
        TwoFactorAuthCodeComponent,
        TwoFactorAuthProfileBlockComponent,
        TwoFactorAuthDisableComponent,
    ],
    exports: [],
})
export class TwoFactorAuthModule {
}
