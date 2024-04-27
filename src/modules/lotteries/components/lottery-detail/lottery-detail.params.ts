import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILotteryPrizesCParams} from 'wlc-engine/modules/lotteries/components/lottery-prizes/lottery-prizes.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'wolf' | CustomType;

export interface ILotteryDetailCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    images?: {
        headerFallback?: string;
    },
    prizesParams?: ILotteryPrizesCParams,
};

export const defaultParams: ILotteryDetailCParams = {
    class: 'wlc-lottery-detail',
    componentName: 'wlc-lottery-detail',
    moduleName: 'lotteries',
    images: {
        headerFallback: '//agstatic.com/wlc/lotteries/main-fallback.svg',
    },
    prizesParams: {
        limit: 10,
        showMoreBtn: true,
    },
};
