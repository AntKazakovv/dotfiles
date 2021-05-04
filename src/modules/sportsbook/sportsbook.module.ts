import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SwiperModule} from 'swiper/angular';
import {UserModule} from 'wlc-engine/modules/user/user.module';
import {GamesModule} from 'wlc-engine/modules/games/games.module';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {SportsbookComponent} from './components/sportsbook/sportsbook.component';
import {SportsbookService} from './system/services/sportsbook/sportsbook.service';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {sportsbookConfig} from './system/config/sportsbook.config';
import {ISportsbookConfig} from './system/interfaces/sportsbook.interface';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<ISportsbookConfig>(sportsbookConfig, _get($config, '$sportsbook', {}));


export const components = {
    'wlc-sportsbook': SportsbookComponent,
};

@NgModule({
    declarations: [
        SportsbookComponent,
    ],
    imports: [
        CommonModule,
        SwiperModule,
        UserModule,
        GamesModule,
        TranslateModule,
        CoreModule,
        AngularResizedEventModule,
    ],
    providers: [
        SportsbookService,
    ],
    exports: [
        SportsbookComponent,
    ],
})
export class SportsbookModule {}
