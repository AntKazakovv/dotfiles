import {NgModule} from '@angular/core';

// -- SERVICES IMPORTS START --;
import {TurnstileService} from 'wlc-engine/modules/security/turnstile/system/services/turnstile.service';
// -- SERVICES IMPORTS END  --;

export const services = {
    'turnstile-service': TurnstileService,
};

@NgModule({
    providers: [
        TurnstileService,
    ],
})
export class TurnstileModule {}
