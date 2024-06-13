import {CountUpOptions} from 'countup.js';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IJackpotWonCParams extends IComponentParams<Theme, Type, ThemeMod> {
    countUpOptions?: CountUpOptions;
    animateOnClick?: boolean;
    userCurrency?: string;
    title?: string;
    amountWon?: number;
    imgPath?: string;
    audioPath?: string;
}

export const defaultParams: IJackpotWonCParams = {
    moduleName: 'local-jackpots',
    componentName: 'wlc-jackpot-won',
    class: 'wlc-jackpot-won',
    userCurrency: 'EUR',
    animateOnClick: false,
    title: gettext('You have won:'),
    imgPath: 'wlc/jackpots/local-jackpot-won.png',
    audioPath: '//agstatic.com/wlc/jackpots/sounds/won.mp3',
    countUpOptions: {
        separator: ',',
    },
};
