import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EventService} from './services/event/event.service';

@NgModule({
    declarations: [

    ],
    providers: [
        EventService
    ],
    imports: [
        CommonModule
    ]
})
export class WlcEventModule {
}
