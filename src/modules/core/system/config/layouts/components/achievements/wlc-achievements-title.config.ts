import {ILayoutComponent} from 'wlc-engine/modules/core';
import {
    IAchievementTitleCParams,
} from 'wlc-engine/modules/loyalty/submodules/achievements/components';

export namespace wlcAchievementTitle {

    export const def: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'achievements.wlc-achievement-title',
                    params: <IAchievementTitleCParams> {
                        customMod: ['profile'],
                        wlcElement: 'header_achievement',
                    },
                },
            ],
        },
    };

    export const group: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'achievements.wlc-achievement-title',
                    params: <IAchievementTitleCParams> {
                        customMod: ['profile'],
                        wlcElement: 'header_achievement',
                        type: 'achievement-group',
                    },
                },
            ],
        },
    };
}
