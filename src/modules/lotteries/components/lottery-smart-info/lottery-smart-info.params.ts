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
        timerText?: string;
        /** Text for case when lottery is finished but results hasn't been ready yet */
        endingText?: string;
    }
};

export const defaultParams: ILotterySmartInfoCParams = {
    class: 'wlc-lottery-smart-info',
    componentName: 'wlc-lottery-smart-info',
    moduleName: 'lotteries',
    texts: {
        ticketsCaption: gettext('Number of your tickets:'),
        timerText: gettext('The raffle starts in'),
        endingText: gettext('The raffle has started and will last no more than 15 minutes! '
            + 'Follow the course of the raffle. Good luck!'),
    },
};
