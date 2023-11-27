import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILotteryPrizesCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Number of rows. If empty */
    limit?: number;
    showMoreBtn?: boolean;
    divider?: string;
};

export const defaultParams: ILotteryPrizesCParams = {
    class: 'wlc-lottery-prizes',
    componentName: 'wlc-lottery-prizes',
    moduleName: 'lotteries',
    divider: '+',
};
