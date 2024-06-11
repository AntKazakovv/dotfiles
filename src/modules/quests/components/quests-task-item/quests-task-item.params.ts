import {
    GlobalHelper,
    CustomType,
    IButtonCParams,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {
    QuestTaskModel,
    TQuestTarget,
} from 'wlc-engine/modules/quests';

export type ComponentTheme = 'default' | 'modal' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IPathsToIcons {
    completedStatus?: string;
    inProgressStatus?: string;
    activeTask?: string;
    notActiveTask?: string;
    light?: string;
}

export interface IQuestsTaskItemCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    task?: QuestTaskModel;
    /**
     * Button params for different quest targets
     */
    modalButtonParams?: {[key in TQuestTarget]?: IButtonCParams};
    pathsToIcons?: IPathsToIcons;
    pathsToFallbackIcons?: IPathsToIcons;
}

export const defaultParams: IQuestsTaskItemCParams = {
    moduleName: 'quests',
    componentName: 'wlc-quests-task-item',
    class: 'wlc-quests-task-item',
    pathsToIcons: {
        completedStatus: 'wlc/quests/completed.svg',
        inProgressStatus: 'wlc/quests/in-progress.svg',
        activeTask: GlobalHelper.gstaticUrl + '/wlc/quests/mask-active.png',
        notActiveTask: GlobalHelper.gstaticUrl + '/wlc/quests/mask-not-active.png',
        light: GlobalHelper.gstaticUrl + '/wlc/quests/shadow.svg',
    },
    pathsToFallbackIcons: {
        completedStatus: 'wlc/quests/completed.svg',
        inProgressStatus: 'wlc/quests/in-progress.svg',
        activeTask: GlobalHelper.gstaticUrl + '/wlc/quests/mask-active.png',
        notActiveTask: GlobalHelper.gstaticUrl + '/wlc/quests/mask-not-active.png',
        light: GlobalHelper.gstaticUrl + '/wlc/quests/shadow.svg',
    },
    modalButtonParams: {
        Bet: {
            theme: 'default',
            common: {
                text: 'Play',
                sref: 'app.catalog',
                srefParams: {
                    category: 'casino',
                },
            },
            wlcElement: 'button_play',
        },
        Deposit: {
            theme: 'default',
            common: {
                text: 'Deposit',
                sref: 'app.profile.cash.deposit',
            },
            wlcElement: 'button_deposit',
        },
        GroupWins: {
            theme: 'default',
            common: {
                text: 'Play',
                sref: 'app.catalog',
                srefParams: {
                    category: 'casino',
                },
            },
            wlcElement: 'button_play',
        },
        Verification: {
            theme: 'default',
            common: {
                text: 'Verify',
                sref: 'app.profile.main.info',
            },
            wlcElement: 'button_verify',
        },
        Win: {
            theme: 'default',
            common: {
                text: 'Play',
                sref: 'app.catalog',
                srefParams: {
                    category: 'casino',
                },
            },
            wlcElement: 'button_play',
        },
        Withdrawal: {
            theme: 'default',
            common: {
                text: 'Withdrawal',
                sref: 'app.profile.cash.withdraw',
            },
            wlcElement: 'button_withdraw',
        },
        Empty: {
            theme: 'default',
            common: {/* filled in code */},
            wlcElement: 'button_empty',
        },
    },
};
