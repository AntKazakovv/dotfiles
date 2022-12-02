import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

// -- SERVICES IMPORTS START --;
import {CaptchaService} from 'wlc-engine/modules/security/captcha/system/services/captcha/captcha.service';
// -- SERVICES IMPORTS END  --;

// -- COMPONENTS IMPORTS  --;
import {CaptchaComponent} from 'wlc-engine/modules/security/captcha/components/captcha/captcha.component';
// -- COMPONENTS IMPORTS END  --;

export const components = {
    'wlc-captcha': CaptchaComponent,
};

export const services = {
    'captcha-service': CaptchaService,
};

@NgModule({
    declarations: [
        CaptchaComponent,
    ],
    imports: [
        CoreModule,
        TranslateModule,
    ],
    providers: [
        CaptchaService,
    ],
    exports: [
        CaptchaComponent,
    ],
})
export class CaptchaModule {}
