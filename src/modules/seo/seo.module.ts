import {NgModule} from '@angular/core';
import {SeoService} from './system/services';

export const services = {
    'seo-service': SeoService,
};

@NgModule({
    providers: [
        SeoService,
    ],
})
export class SeoModule { }
