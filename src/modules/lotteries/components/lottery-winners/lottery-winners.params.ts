import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | 'no-pagination' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILotteryWinnersCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** How many places show by default */
    placesLimit?: number;
    showAllBtnParams?: IButtonCParams;
};

export const defaultParams: ILotteryWinnersCParams = {
    class: 'wlc-lottery-winners',
    componentName: 'wlc-lottery-winners',
    moduleName: 'lotteries',
    type: 'no-pagination',
    placesLimit: 5,
    showAllBtnParams: {
        theme: 'cleared',
        common: {
            text: gettext('Show all'),
        },
    },
};
