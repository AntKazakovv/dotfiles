import {NgModule} from '@angular/core';

import _get from 'lodash-es/get';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    LoyaltyInfoComponent,
    LevelNameComponent,
    LevelNumberComponent,
    LoyaltyLevelComponent,
    LoyaltyLevelsComponent,
    LoyaltyLevelsWpComponent,
    LoyaltyProgramComponent,
    LoyaltyProgramDefaultComponent,
    LoyaltyProgramWolfComponent,
} from 'wlc-engine/modules/loyalty/components';
import {StaticModule} from 'wlc-engine/modules/static/static.module';
import {
    ILoyaltyConfig,
    loyaltyConfig,
    LoyaltyLevelsService,
} from 'wlc-engine/modules/loyalty/system';
import * as $config from 'wlc-config/index';

export const moduleConfig = GlobalHelper.mergeConfig<ILoyaltyConfig>(loyaltyConfig, _get($config, '$loyalty', {}));

export const components = {
    'wlc-loyalty-info': LoyaltyInfoComponent,
    'wlc-loyalty-level': LoyaltyLevelComponent,
    'wlc-loyalty-levels': LoyaltyLevelsComponent,
    'wlc-loyalty-levels-wp': LoyaltyLevelsWpComponent,
    'wlc-loyalty-program': LoyaltyProgramComponent,
    'wlc-level-name': LevelNameComponent,
    'wlc-level-number': LevelNumberComponent,
};

export const services = {
    'loyalty-levels-service': LoyaltyLevelsService,
};

@NgModule({
    imports: [
        CoreModule,
        StaticModule,
    ],
    declarations: [
        LoyaltyInfoComponent,
        LoyaltyLevelsWpComponent,
        LevelNameComponent,
        LevelNumberComponent,
        LoyaltyLevelComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
        LoyaltyProgramDefaultComponent,
        LoyaltyProgramWolfComponent,
    ],
    providers: [
        LoyaltyLevelsService,
    ],
    exports: [
        LoyaltyInfoComponent,
        LoyaltyLevelsWpComponent,
        LevelNameComponent,
        LevelNumberComponent,
        LoyaltyLevelComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
    ],
})
export class LoyaltyModule {}
