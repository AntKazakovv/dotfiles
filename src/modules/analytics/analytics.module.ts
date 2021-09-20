import {NgModule} from '@angular/core';
import {AnalyticsService} from 'wlc-engine/modules/analytics';

export const services = {
    'analytics-service': AnalyticsService,
};

@NgModule()
export class AnalyticsModule {
    constructor(private analyticsService: AnalyticsService) {}
}
