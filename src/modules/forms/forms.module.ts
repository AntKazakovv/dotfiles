import {NgModule} from '@angular/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PhoneFieldComponent} from 'wlc-engine/modules/forms/components/phone-field/phone-field.component';

export const components = {
    'wlc-phone-field': PhoneFieldComponent,
};

@NgModule({
    imports: [
        CoreModule,
    ],
    declarations: [
        PhoneFieldComponent,
    ],
    exports: [
        PhoneFieldComponent,
    ],
    providers: [],
})
export class FormsModule {}
