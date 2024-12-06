import {BehaviorSubject} from 'rxjs';

import {
    CustomType,
    GlobalHelper,
    IButtonCParams,
    IComponentParams,
    IModalConfig,
    ITimerCParams,
} from 'wlc-engine/modules/core';
import {
    IQuest,
    QuestModel,
} from 'wlc-engine/modules/quests';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IQuestStatusImages {
    noProgress?: string;
    inProgress?: string;
    finished?: string;
}

export const enum CursorEnum {
    POINTER = 'pointer',
    WAIT = 'wait',
}

export interface IQuestProgressCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    quest?: QuestModel;
    updateQuestData?: (questId: string, newData: Partial<IQuest>) => void;
    timerParams?: ITimerCParams;
    claimButtonParams?: IButtonCParams;
    questPrizesModalConfig?: IModalConfig;
    questTakePrizeModalConfig?: IModalConfig;
    confirmImprovementBonusModalConfig?: IModalConfig;
    pathsToQuestStatusImages?: IQuestStatusImages;
    pathsToQuestStatusFallbackImages?: IQuestStatusImages;
    pathToLeftImage?: string;
    pathToLeftImageFallback?: string;
    claimDatePrefixText?: string;
}

export const defaultParams: IQuestProgressCParams = {
    moduleName: 'quests',
    componentName: 'wlc-quest-progress',
    class: 'wlc-quest-progress',
    pathsToQuestStatusImages: {
        noProgress: GlobalHelper.gstaticUrl + '/wlc/quests/casket-closed.png',
        inProgress: GlobalHelper.gstaticUrl + '/wlc/quests/casket-in-progress.png',
        finished: GlobalHelper.gstaticUrl + '/wlc/quests/casket-opened.png',
    },
    pathsToQuestStatusFallbackImages: {
        noProgress: GlobalHelper.gstaticUrl + '/wlc/quests/casket-closed.png',
        inProgress: GlobalHelper.gstaticUrl + '/wlc/quests/casket-in-progress.png',
        finished: GlobalHelper.gstaticUrl + '/wlc/quests/casket-opened.png',
    },
    pathToLeftImage: GlobalHelper.gstaticUrl + '/wlc/quests/keys.png',
    pathToLeftImageFallback: GlobalHelper.gstaticUrl + '/wlc/quests/keys.png',
    timerParams: {
        theme: 'default',
        dividers: {
            units: ':',
        },
        common: {
            noDays: true,
        },
    },
    claimButtonParams: {
        pending$: new BehaviorSubject<boolean>(false),
        common: {
            text: gettext('Claim'),
            typeAttr: 'button',
        },
        wlcElement: 'button_claim-quest',
    },
    questPrizesModalConfig: {
        id: 'quest-prizes',
        componentName: 'quests.wlc-quest-prizes-modal',
        modalTitle: gettext('Select a reward'),
        size: 'md',
        rejectBtnVisibility: false,
        showConfirmBtn: false,
        showFooter: false,
    },
    questTakePrizeModalConfig: {
        id: 'quest-prize-choice',
        componentName: 'bonuses.wlc-bonus-choice-modal',
        size: 'md',
        showFooter: false,
    },
    confirmImprovementBonusModalConfig: {
        id: 'confirm-improvement-bonus',
        componentName: 'bonuses.wlc-confirm-improvement-modal',
        size: 'md',
        showFooter: false,
    },
    claimDatePrefixText: gettext('Claimed'),
};
