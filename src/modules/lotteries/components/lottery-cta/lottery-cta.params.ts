import {IButtonCParams} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'deposit' | CustomType;
export type ComponentThemeMod = 'default' | 'wolf' | CustomType;

export interface ILotteryCtaCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    depositBtnParams?: IButtonCParams;
    readMoreBtnParams?: IButtonCParams;
};

export const defaultParams: ILotteryCtaCParams = {
    class: 'wlc-lottery-cta',
    componentName: 'wlc-lottery-cta',
    moduleName: 'lotteries',
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
