import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PwaNotificationComponent} from './components/pwa-notification/pwa-notification.component';

export const components = {
    'wlc-pwa-notification': PwaNotificationComponent,
};

export const services = {
};

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        TranslateModule,
    ],
    declarations: [
        PwaNotificationComponent,
    ],
    providers: [],
    exports: [
        PwaNotificationComponent,
    ],
})
export class PwaModule {}
