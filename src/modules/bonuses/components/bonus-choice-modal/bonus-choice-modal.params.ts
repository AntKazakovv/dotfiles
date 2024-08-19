import {BehaviorSubject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
    GlobalHelper,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IBonusChoiceModalCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    bonus?: Bonus;
    headerMessage?: string;
    headerMessagePostfix?: string;
    title?: string;
    takeBtnParams?: IButtonCParams;
    onConfirm?: Function;
    image?: string,
    imageFallback?: string,
}

export const defaultParams: IBonusChoiceModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-choice-modal',
    class: 'wlc-bonus-choice-modal',
    title: gettext('Congratulations!'),
    headerMessage: gettext('You have won:'),
    takeBtnParams: {
        pending$: new BehaviorSubject<boolean>(false),
        common: {
            text: gettext('Take'),
            typeAttr: 'button',
        },
        wlcElement: 'button_take-quest-prize',
    },
    image: GlobalHelper.gstaticUrl + '/wlc/bonuses/choice-modal/cash.png',
    imageFallback: GlobalHelper.gstaticUrl + '/wlc/bonuses/choice-modal/cash.png',
};
