import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILotterySmartInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    texts?: {
        ticketsCaption?: string;
    }
};

export const defaultParams: ILotterySmartInfoCParams = {
    class: 'wlc-lottery-smart-info',
    componentName: 'wlc-lottery-smart-info',
    moduleName: 'lotteries',
    texts: {
        ticketsCaption: gettext('Number of your tickets:'),
    },
};
