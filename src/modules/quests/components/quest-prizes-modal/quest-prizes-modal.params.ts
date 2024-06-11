import {BehaviorSubject} from 'rxjs';

import {
    CustomType,
    GlobalHelper,
    IButtonCParams,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {QuestModel} from 'wlc-engine/modules/quests';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IQuestPrizesModalCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    quest?: QuestModel;
    prizeCount?: number;
    prizeIconPath?: string;
    prizeIconFallbackPath?: string;
    openBtnParams?: IButtonCParams;
    onClick?: Function;
}

export const defaultParams: IQuestPrizesModalCParams = {
    moduleName: 'quests',
    componentName: 'wlc-quest-prizes-modal',
    class: 'wlc-quest-prizes-modal',
    prizeCount: 9,
    prizeIconPath: GlobalHelper.gstaticUrl + '/wlc/quests/casket.png',
    prizeIconFallbackPath: GlobalHelper.gstaticUrl + '/wlc/quests/casket.png',
    openBtnParams: {
        wlcElement: 'button_open-quest-prize',
        pending$: new BehaviorSubject<boolean>(false),
        common: {
            text: gettext('Open'),
            typeAttr: 'button',
        },
    },
};
