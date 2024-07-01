import {NgModule} from '@angular/core';

import _get from 'lodash-es/get';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    QuestsTitleComponent,
    QuestsTaskListComponent,
    QuestsTaskItemComponent,
    QuestProgressComponent,
    QuestPrizesModalComponent,
} from 'wlc-engine/modules/quests/components';
import {
    IQuestsConfig,
    questsConfig,
    QuestsService,
} from 'wlc-engine/modules/quests/system';
import {GlobalHelper} from 'wlc-engine/modules/core';
import * as $config from 'wlc-config/index';

export const moduleConfig = GlobalHelper.mergeConfig<IQuestsConfig>(questsConfig, _get($config, '$quests', {}));
export const components = {
    'wlc-quests-title': QuestsTitleComponent,
    'wlc-quests-task-item': QuestsTaskItemComponent,
    'wlc-quests-task-list': QuestsTaskListComponent,
    'wlc-quests-item-progress': QuestProgressComponent,
    'wlc-quest-prizes-modal': QuestPrizesModalComponent,
};
export const services = {
    'quests-service': QuestsService,
};

@NgModule({
    imports: [
        CoreModule,
    ],
    declarations: [
        QuestsTitleComponent,
        QuestsTaskItemComponent,
        QuestsTaskListComponent,
        QuestProgressComponent,
        QuestPrizesModalComponent,
    ],
    providers: [
        QuestsService,
    ],
    exports: [
        QuestsTitleComponent,
        QuestsTaskItemComponent,
        QuestsTaskListComponent,
        QuestProgressComponent,
        QuestPrizesModalComponent,
    ],
})
export class QuestsModule {}
