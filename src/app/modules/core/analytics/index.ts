import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnalyticsService} from './services/analytics/analytics.service';

@NgModule({
    declarations: [
    ],
    providers: [
        AnalyticsService
    ],
    exports: [
    ],
    imports: [
        CommonModule
    ]
})
export class WlcAnalyticsModule {
}
