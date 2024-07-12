import {IAchievementsConfig} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces';

export const achievementsConfig: IAchievementsConfig = {
    achievements: {
        notification: {
            titleText: gettext('Achievement received'),
            message: gettext('You have received the achievement:'),
            levelUpTitleText: gettext('Congratulations!'),
            levelUpMessage: gettext('The achievement has been leveled up:'),
        },
    },
};
