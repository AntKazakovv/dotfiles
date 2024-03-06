import {NgModule} from '@angular/core';
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
