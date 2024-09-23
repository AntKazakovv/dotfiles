import {
    IQuestsConfig,
    QuestTaskModel,
} from 'wlc-engine/modules/quests';
import {GlobalHelper} from 'wlc-engine/modules/core';

export const questsConfig: IQuestsConfig = {
    /**
     * Config for notification when a quest is completed
     * **/
    notification: {
        questTitle: gettext('Congratulations!'),
        questMessage: gettext(
            'You have fulfilled all conditions of the quest "{{questname}}"'
            + ' and can get your reward!',
        ),
        fallbackIcon: GlobalHelper.gstaticUrl + '/wlc/quests/mask-active.png',
    },
    /**
     * Data modifier for quests data.
     * **/
    questsDataModifiers: {
        quests: {
            /**
             * Array of lodash _orderBy function params
             * {iterator} - field name or ordering function
             * {order} - order direction
             *
             * Example:
             *
             * orders: [
             *     {
             *         iterator: 'id',
             *         order: 'desc',
             *     },
             * ]
             **/
            orders: [],
        },
        tasks: {
            /**
             * Example:
             *
             * orders: [
             *     {
             *         iterator: (task: QuestTaskModel) => task.progressCurrent * 100 / task.progressTotal,
             *         order: 'desc',
             *     },
             * ]
             **/
            orders: [
                {
                    iterator: (task: QuestTaskModel) => task.progressCurrent * 100 / (task.progressTotal || 1),
                    order: 'desc',
                },
            ],
        },
    },
};
