import {NgModule} from '@angular/core';

import {TranslateModule} from '@ngx-translate/core';
import _get from 'lodash-es/get';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    AchievementItemComponent,
    AchievementListComponent,
    AchievementsService,
    AchievementTitleComponent,
    AchievementLevelsComponent,
    AchievementTagComponent,
    achievementsConfig,
    IAchievementsConfig,
} from 'wlc-engine/modules/loyalty/submodules/achievements';
import {GlobalHelper} from 'wlc-engine/modules/core';

import * as $config from 'wlc-config/index';

export const moduleConfig =
    GlobalHelper.mergeConfig<IAchievementsConfig>(achievementsConfig, _get($config, '$achievements', {}));

export const components = {
    'wlc-achievement-item': AchievementItemComponent,
    'wlc-achievement-list': AchievementListComponent,
    'wlc-achievement-title': AchievementTitleComponent,
    'wlc-achievement-levels': AchievementLevelsComponent,
    'wlc-achievement-tag': AchievementTagComponent,
};

export const services = {
    'achievement-service': AchievementsService,
};

@NgModule({
    imports: [
        CoreModule,
        TranslateModule,
    ],
    declarations: [
        AchievementItemComponent,
        AchievementListComponent,
        AchievementTitleComponent,
        AchievementLevelsComponent,
        AchievementTagComponent,
    ],
    providers: [
        AchievementsService,
    ],
    exports: [
        AchievementItemComponent,
        AchievementListComponent,
        AchievementTitleComponent,
        AchievementLevelsComponent,
        AchievementTagComponent,
    ],
})
export class AchievementsModule {}
