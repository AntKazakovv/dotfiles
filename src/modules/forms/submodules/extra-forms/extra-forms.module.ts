import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    AmountFieldComponent,
} from 'wlc-engine/modules/forms/submodules/extra-forms/components/amount-field/amount-field.component';

export const components = {
    'wlc-amount-field': AmountFieldComponent,
};

@NgModule({
    imports: [
        CoreModule,
    ],
    declarations: [
        AmountFieldComponent,
    ],
    exports: [
        AmountFieldComponent,
    ],
    providers: [],
})
export class ExtraFormsModule {}
