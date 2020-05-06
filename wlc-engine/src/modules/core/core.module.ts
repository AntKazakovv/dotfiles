import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataService, EventService} from './services';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        DataService,
        EventService,
    ]
})
export class CoreModule {}
