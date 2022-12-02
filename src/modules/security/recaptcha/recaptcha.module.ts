import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {CompilerModule} from 'wlc-engine/modules/compiler';

// -- SERVICES IMPORTS START --;
import {RecaptchaService} from 'wlc-engine/modules/security/recaptcha/system/services';
// -- SERVICES IMPORTS END  --;

// -- COMPONENTS IMPORTS  --;
import {
    RecaptchaPolicyComponent,
} from 'wlc-engine/modules/security/recaptcha/components/recaptcha-policy/recaptcha-policy.component';
// -- COMPONENTS IMPORTS END  --;


export const components = {
    'wlc-recaptcha-policy': RecaptchaPolicyComponent,
};

export const services = {
    'recaptcha-service': RecaptchaService,
};

@NgModule({
    declarations: [
        RecaptchaPolicyComponent,
    ],
    imports: [
        CompilerModule,
        CoreModule,
        TranslateModule,
    ],
    providers: [
        RecaptchaService,
    ],
    exports: [
        RecaptchaPolicyComponent,
    ],
})
export class RecaptchaModule {}
