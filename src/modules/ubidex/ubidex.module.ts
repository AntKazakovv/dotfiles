import {NgModule} from '@angular/core';
import {UbidexService} from 'wlc-engine/modules/ubidex/system/services/ubidex.service';

export const services = {
    'ubidex-service': UbidexService,
};

@NgModule()
export class UbidexModule {
}
