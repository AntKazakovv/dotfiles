import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProcessService} from './system/services/process/process.service';

export const services = {
    'process-service': ProcessService,
};

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        ProcessService,
    ],
})
export class MonitoringModule {
}
