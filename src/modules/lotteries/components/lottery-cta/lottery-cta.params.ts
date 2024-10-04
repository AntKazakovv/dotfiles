import {BehaviorSubject} from 'rxjs';
import {IButtonCParams} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'deposit' | CustomType;
export type ComponentThemeMod = 'default' | 'wolf' | CustomType;

export interface ILotteryCtaCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    depositBtnParams?: IButtonCParams;
    readMoreBtnParams?: IButtonCParams;
    timerText?: string;
    /** Used in deposit type */
    amount$?: BehaviorSubject<number>;
    /** Used in deposit type */
    lottery$?: BehaviorSubject<Lottery>;
    /** Use it for hide button (hides only in deposit widget) */
    hideButton?: boolean;
    showTicketsCounter?: boolean;
};

export const defaultParams: ILotteryCtaCParams = {
    class: 'wlc-lottery-cta',
    componentName: 'wlc-lottery-cta',
    moduleName: 'lotteries',
    timerText: gettext('Time until the end of the ticket issuance:'),
    depositBtnParams: {
        common: {
            text: gettext('Deposit'),
            sref: 'app.profile.cash.deposit',
        },
    },
    readMoreBtnParams: {
        themeMod: 'secondary',
        common: {
            text: gettext('Read more'),
        },
    },
};
