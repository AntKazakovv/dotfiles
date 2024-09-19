'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {Transition} from '@uirouter/core';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {
    AchievementGroupModel,
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';

export const profileAchievementsState: Ng2StateDeclaration = {
    abstract: true,
    url: '/achievements',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.achievements.use'),
    ],
};

export const profileAchievementsMainState: Ng2StateDeclaration = {
    url: '?group',
    onEnter: async (transition: Transition): Promise<void> => {
        if (transition.params().group) {
            const injectionService: InjectionService = transition.injector().get(InjectionService);
            const achievementsService: AchievementsService = await injectionService
                .getService('achievements.achievement-service');

            const group: AchievementGroupModel | null = achievementsService.getGroupByState(transition);

            if (!group) {
                transition.abort();
                const locale = transition.params().locale || transition.injector().get('lang') || 'en';
                transition.router.stateService.go('app.profile.achievements.main', {
                    locale,
                    group: undefined,
                });
            }
        }
    },
};
