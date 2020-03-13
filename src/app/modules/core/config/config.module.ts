import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConfigService} from './services/config/config.service';

@NgModule({
    declarations: [

    ],
    providers: [
        ConfigService
    ],
    imports: [
        CommonModule
    ]
})
export class WlcConfigModule {
}
