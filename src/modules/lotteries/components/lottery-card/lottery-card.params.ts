import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILotteryPrizePoolCParams}
    from 'wlc-engine/modules/lotteries/components/lottery-prizepool/lottery-prizepool.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'wolf' | CustomType;

export interface ILotteryCardCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    texts?: {
        noContentTitle?: string;
    }
    images?: {
        noContent?: string;
        imageMainFallback?: string;
    }
    prizesParams?: ILotteryPrizePoolCParams;
};

export const defaultParams: ILotteryCardCParams = {
    class: 'wlc-lottery-card',
    componentName: 'wlc-lottery-card',
    moduleName: 'lotteries',
    prizesParams: {
        limit: 3,
    },
    images: {
        noContent: '//agstatic.com/wlc/lotteries/no-content.png',
        imageMainFallback: '//agstatic.com/wlc/lotteries/main-fallback.svg',
    },
    texts: {
        noContentTitle: gettext('There are no active lotteries at the moment'),
    },
};
