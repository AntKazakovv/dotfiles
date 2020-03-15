import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ErrorService} from './services/error/error.service';
import {LogService} from './services/log/log.service';

@NgModule({
    declarations: [

    ],
    providers: [
        ErrorService,
        LogService
    ],
    exports: [

    ],
    imports: [
        CommonModule
    ]
})
export class WlcLogModule {
}
