'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {Transition} from '@uirouter/core';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {
    AchievementGroupModel,
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements';

export const profileAchievementsState: Ng2StateDeclaration = {
    abstract: true,
    url: '/achievements',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.achievements.use'),
    ],
};

export const profileAchievementsMainState: Ng2StateDeclaration = {
    url: '?group',
    onEnter: (transition: Transition): void => {
        if (transition.params().group) {
            const achievementsService: AchievementsService = transition.injector().get(AchievementsService);
            const group: AchievementGroupModel | null = achievementsService.getGroupByState(transition);

            if (!group) {
                transition.abort();
                const {locale} = transition.params();
                transition.router.stateService.go('app.profile.achievements.main', {
                    locale: locale || transition.injector().get('lang') || 'en',
                    group: undefined,
                });
            }
        }
    },
};
