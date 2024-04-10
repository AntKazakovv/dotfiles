import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'wolf' | CustomType;

export interface ILotteryPrizePoolCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Number of rows. If empty */
    limit?: number;
    showMoreBtn?: boolean;
    /** Divider between prizes in row */
    divider?: string;
};

export const defaultParams: ILotteryPrizePoolCParams = {
    class: 'wlc-lottery-prizepool',
    componentName: 'wlc-lottery-prizepool',
    moduleName: 'lotteries',
    divider: '+',
};
