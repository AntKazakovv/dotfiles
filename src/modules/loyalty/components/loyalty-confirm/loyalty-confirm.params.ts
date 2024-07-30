import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TLoyaltyItem} from 'wlc-engine/modules/loyalty/system';
import {WalletsParams} from 'wlc-engine/modules/multi-wallet/components/wallets/wallets.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'store' | 'bonus' | 'tournament';
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyConfirmCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Params for wallets selector */
    walletsParams?: WalletsParams;
    decorUrl?: string;
    item?: TLoyaltyItem;
    buttonCaptions?: {
        [Property in ComponentType]?: string;
    };
};

export const defaultParams: ILoyaltyConfirmCParams = {
    class: 'wlc-loyalty-confirm',
    componentName: 'wlc-loyalty-confirm',
    moduleName: 'loyalty',
    walletsParams: {
        type: 'loyalty',
        // TODO: check themeMod after refactor wallets component
        themeMod: 'finances',
    },
    decorUrl: '/wlc/icons/status/confirm.svg',
    buttonCaptions: {
        store: gettext('Buy now'),
        tournament: gettext('Let\'s play!'),
        bonus: gettext('Yes'),
    },
};
