import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

import {GamblingBanModalComponent} from './components/gambling-ban-modal/gambling-ban-modal.component';
import {GamblingBanService} from './system/services/gambling-ban/gambling-ban.service';

export const services = {
    'gambling-ban-service': GamblingBanService,
} as const;

export const components = {
    'wlc-gambling-ban-modal': GamblingBanModalComponent,
} as const;

@NgModule({
    imports: [
        CoreModule,
        TranslateModule,
    ],
    providers: [GamblingBanService],
    declarations: [GamblingBanModalComponent],
    exports: [],
})
export class GamblingBanModule {}
