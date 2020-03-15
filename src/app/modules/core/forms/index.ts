import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ValidatorService} from './services/validator/validator.service';

@NgModule({
    declarations: [

    ],
    providers: [
        ValidatorService
    ],
    exports: [

    ],
    imports: [
        CommonModule
    ]
})
export class WlcFormsModule {
}
