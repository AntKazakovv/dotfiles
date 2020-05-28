import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataService, EventService, ConfigService} from './services';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        DataService,
        EventService,
        ConfigService,
    ]
})
export class CoreModule {}
