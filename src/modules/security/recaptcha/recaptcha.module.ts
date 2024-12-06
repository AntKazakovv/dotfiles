import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

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
        CoreModule,
    ],
    providers: [
        RecaptchaService,
    ],
    exports: [
        RecaptchaPolicyComponent,
    ],
})
export class RecaptchaModule {}
