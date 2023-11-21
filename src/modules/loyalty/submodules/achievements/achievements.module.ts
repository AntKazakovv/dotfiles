import {NgModule} from '@angular/core';

import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    AchievementItemComponent,
    AchievementListComponent,
    AchievementsService,
    AchievementTitleComponent,
} from 'wlc-engine/modules/loyalty/submodules/achievements';

export const components = {
    'wlc-achievement-item': AchievementItemComponent,
    'wlc-achievement-list': AchievementListComponent,
    'wlc-achievement-title': AchievementTitleComponent,
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
    ],
    providers: [
        AchievementsService,
    ],
    exports: [
        AchievementItemComponent,
        AchievementListComponent,
        AchievementTitleComponent,
    ],
})
export class AchievementsModule {}
