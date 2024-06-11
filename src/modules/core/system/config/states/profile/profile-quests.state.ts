'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {Transition} from '@uirouter/core';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {
    QuestModel,
    QuestsService,
} from 'wlc-engine/modules/quests';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';

export const profileQuestsState: Ng2StateDeclaration = {
    abstract: true,
    url: '/quests',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.quests.use'),
    ],
};

/**
 * Here we must guarantee that the quest with 'questId' is existed
 * **/
export const profileQuestsMainState: Ng2StateDeclaration = {
    url: '?questId',
    onEnter: (transition: Transition): void => {
        setTimeout(async (): Promise<void> => {
            const params = transition.params();

            if ('questId' in params) {
                const injectionService: InjectionService = transition.injector().get(InjectionService);
                const questsService: QuestsService =
                    await injectionService.getService<QuestsService>('quests.quests-service');
                const quest: QuestModel | null = await questsService.getQuestByState(transition);

                if (!quest) {
                    const quests: Map<string, QuestModel> = await questsService.getQuestsMap();
                    const activeQuestId: string = quests.keys().next().value;

                    if (activeQuestId) {
                        transition.abort();
                        transition.router.stateService.go('app.profile.quests.main', {
                            locale: params['locale'] || transition.injector().get('lang') || 'en',
                            questId: activeQuestId,
                        });
                    }
                }
            }
        });
    },
};
