import {NgModule} from '@angular/core';
import {IntercomService} from './system/services/intercom.service';

export const services = {
    'intercom-service': IntercomService,
};

@NgModule({
    providers: [
        IntercomService,
    ],
    exports: [],
})

export class ExternalServicesModule {
}
