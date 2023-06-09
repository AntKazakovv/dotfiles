import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    AchievementItemComponent,
    AchievementListComponent,
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements';

export const components = {
    'wlc-achievement-item': AchievementItemComponent,
    'wlc-achievement-list': AchievementListComponent,
};

@NgModule({
    imports: [
        CoreModule,
        TranslateModule,
    ],
    declarations: [
        AchievementItemComponent,
        AchievementListComponent,
    ],
    providers: [
        AchievementsService,
    ],
    exports: [
        AchievementItemComponent,
        AchievementListComponent,
    ],
})
export class AchievementsModule {}
