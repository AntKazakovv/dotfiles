import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SmsService} from './services/sms/sms.service';

import {PhoneVerifyComponent} from './components/phone-verify/phone-verify.component';

@NgModule({
    declarations: [
        PhoneVerifyComponent
    ],
    providers: [
        SmsService
    ],
    imports: [
        CommonModule
    ]
})
export class WlcSmsModule {
}
