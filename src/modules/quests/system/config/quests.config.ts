import {
    IQuestsConfig,
    QuestTaskModel,
} from 'wlc-engine/modules/quests';

export const questsConfig: IQuestsConfig = {
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
