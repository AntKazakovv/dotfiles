import {IButtonCParams} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type TLotteryBtnAction = 'readmore' | 'deposit';

export interface ILotteryButtonsCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    btnsParams?: Record<string, IButtonCParams>
};

export const defaultParams: ILotteryButtonsCParams = {
    class: 'wlc-lottery-buttons',
    componentName: 'wlc-lottery-buttons',
    moduleName: 'lotteries',
    btnsParams: {
        readMore: {
            themeMod: 'secondary',
            common: {
                text: gettext('Read more'),
            },
        },
        deposit: {
            common: {
                text: gettext('Deposit'),
                sref: 'app.profile.cash.deposit',
            },
        },
    },
};
