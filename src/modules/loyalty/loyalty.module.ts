import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import _get from 'lodash-es/get';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    LoyaltyInfoComponent,
    LevelNameComponent,
    LoyaltyLevelComponent,
    LoyaltyLevelsComponent,
    LoyaltyProgramComponent,
    LoyaltyLevelsService,
} from 'wlc-engine/modules/loyalty';
import {StaticModule} from 'wlc-engine/modules/static/static.module';
import {
    ILoyaltyConfig,
    loyaltyConfig,
} from './system';
import * as $config from 'wlc-config/index';

export const moduleConfig = GlobalHelper.mergeConfig<ILoyaltyConfig>(loyaltyConfig, _get($config, '$loyalty', {}));

export const components = {
    'wlc-loyalty-info': LoyaltyInfoComponent,
    'wlc-loyalty-level': LoyaltyLevelComponent,
    'wlc-loyalty-levels': LoyaltyLevelsComponent,
    'wlc-loyalty-program': LoyaltyProgramComponent,
    'wlc-level-name': LevelNameComponent,
};

@NgModule({
    imports: [
        TranslateModule,
        CoreModule,
        StaticModule,
    ],
    declarations: [
        LoyaltyInfoComponent,
        LevelNameComponent,
        LoyaltyLevelComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
    ],
    providers: [
        LoyaltyLevelsService,
    ],
    exports: [
        LoyaltyInfoComponent,
        LevelNameComponent,
        LoyaltyLevelComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
    ],
})
export class LoyaltyModule {}
