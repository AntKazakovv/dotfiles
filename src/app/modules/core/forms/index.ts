import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ValidatorService} from './services/validator/validator.service';

import {DatepickerComponent} from './components/datepicker/datepicker.component';
import {GoogleCaptchaComponent} from './components/google-captcha/google-captcha.component';

@NgModule({
    declarations: [
        DatepickerComponent,
        GoogleCaptchaComponent
    ],
    providers: [
        ValidatorService
    ],
    exports: [
        DatepickerComponent,
        GoogleCaptchaComponent
    ],
    imports: [
        CommonModule
    ]
})
export class WlcFormsModule {
}
