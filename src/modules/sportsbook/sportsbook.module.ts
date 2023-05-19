import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {SportsbookComponent} from './components/sportsbook/sportsbook.component';
import {BetradarDailyMatchComponent} from './components/betradar-daily-match/betradar-daily-match.component';
import {BetradarPopularEventsComponent} from './components/betradar-popular-events/betradar-popular-events.component';
import {
    SportsbookService,
    BetradarService,
} from './system/services';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {sportsbookConfig} from './system/config/sportsbook.config';
import {ISportsbookConfig} from './system/interfaces/sportsbook.interface';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<ISportsbookConfig>(sportsbookConfig, _get($config, '$sportsbook', {}));


export const components = {
    'wlc-sportsbook': SportsbookComponent,
    'wlc-betradar-daily-match': BetradarDailyMatchComponent,
    'wlc-betradar-popular-events': BetradarPopularEventsComponent,
};

export const services = {
    'sportsbook-service': SportsbookService,
    'betradar-service': BetradarService,
};

@NgModule({
    declarations: [
        SportsbookComponent,
        BetradarDailyMatchComponent,
        BetradarPopularEventsComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
    ],
    providers: [
        SportsbookService,
    ],
    exports: [
        SportsbookComponent,
        BetradarDailyMatchComponent,
        BetradarPopularEventsComponent,
    ],
})
export class SportsbookModule {}
