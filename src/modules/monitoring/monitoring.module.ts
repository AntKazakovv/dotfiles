import {NgModule} from '@angular/core';
import {ProcessService} from './system/services/process/process.service';

export const services = {
    'process-service': ProcessService,
};

@NgModule({
    providers: [
        ProcessService,
    ],
})
export class MonitoringModule {
}
