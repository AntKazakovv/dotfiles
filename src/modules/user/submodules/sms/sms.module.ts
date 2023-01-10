import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

// services
import {SmsService} from 'wlc-engine/modules/user/submodules/sms/system/services/sms/sms.service';
// end of services

// components
import {
    RestoreSmsCodeFormComponent,
} from 'wlc-engine/modules/user/submodules/sms/components/restore-sms-code-form/restore-sms-code-form.component';
import {
    SmsVerificationComponent,
} from 'wlc-engine/modules/user/submodules/sms/components/sms-verification/sms-verification.component';
// end of components

export const components = {
    'wlc-restore-sms-code-form': RestoreSmsCodeFormComponent,
    'wlc-sms-verification': SmsVerificationComponent,
};

export const services = {
    'sms-service': SmsService,
};

@NgModule({
    declarations: [
        RestoreSmsCodeFormComponent,
        SmsVerificationComponent,
    ],
    imports: [
        CoreModule,
        TranslateModule,
    ],
    providers: [
        SmsService,
    ],
    exports: [
        RestoreSmsCodeFormComponent,
        SmsVerificationComponent,
    ],
})
export class SmsModule {
}
