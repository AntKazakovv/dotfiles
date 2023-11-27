import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILotteryPrizesCParams} from 'wlc-engine/modules/lotteries/components/lottery-prizes/lottery-prizes.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'wolf' | CustomType;

export interface ILotteryCardCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    texts?: {
        noContentTitle?: string;
        ticketsCaption?: string;
    }
    images?: {
        noContent?: string;
        imageMainFallback?: string;
    }
    prizesParams?: ILotteryPrizesCParams;
};

export const defaultParams: ILotteryCardCParams = {
    class: 'wlc-lottery-card',
    componentName: 'wlc-lottery-card',
    moduleName: 'lotteries',
    prizesParams: {
        limit: 3,
    },
    images: {
        noContent: '/gstatic/wlc/lotteries/no-content.png',
        imageMainFallback: '/gstatic/wlc/lotteries/main-fallback.svg',
    },
    texts: {
        noContentTitle: gettext('There are no active lotteries at the moment'),
        ticketsCaption: gettext('Number of your tickets:'),
    },
};
