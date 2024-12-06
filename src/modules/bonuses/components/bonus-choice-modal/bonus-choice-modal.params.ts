import {BehaviorSubject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
    GlobalHelper,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IBonusChoiceModalCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    bonus?: Bonus;
    headerMessage?: string;
    title?: string;
    takeBtnParams?: IButtonCParams;
    improveBtnParams?: IButtonCParams;
    onTakeImproved?: (bonus: Bonus) => Promise<void>;
    onTakeBase?: (bonus: Bonus) => Promise<void>;
    image?: string,
    imageFallback?: string,
    digitsInfo?: string,
}

export const defaultParams: IBonusChoiceModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-choice-modal',
    class: 'wlc-bonus-choice-modal',
    title: gettext('Congratulations!'),
    headerMessage: gettext('You have won:'),
    takeBtnParams: {
        pending$: new BehaviorSubject<boolean>(false),
        themeMod: 'secondary',
        common: {
            text: gettext('Take'),
            typeAttr: 'button',
        },
        wlcElement: 'button_take-quest-prize',
    },
    improveBtnParams: {
        pending$: new BehaviorSubject<boolean>(false),
        common: {
            text: gettext('Improve'),
            typeAttr: 'button',
            animation: {
                type: 'glare',
                handlerType: 'click',
            },
        },
        wlcElement: 'button_take-quest-prize',
    },
    image: GlobalHelper.gstaticUrl + '/wlc/bonuses/choice-modal/cash.png',
    imageFallback: GlobalHelper.gstaticUrl + '/wlc/bonuses/choice-modal/cash.png',
    digitsInfo: '1-0-2',
};
