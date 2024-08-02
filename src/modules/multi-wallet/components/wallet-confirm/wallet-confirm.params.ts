import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {WalletsParams} from 'wlc-engine/modules/multi-wallet/components/wallets/wallets.params';
import {TWalletConfirmItem} from 'wlc-engine/modules/multi-wallet/system/interfaces';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'store' | 'bonus' | 'tournament';
export type ComponentThemeMod = 'default' | CustomType;

export interface IWalletConfirmCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Params for wallets selector */
    walletsParams?: WalletsParams;
    decorUrl?: string;
    model?: TWalletConfirmItem;
    buttonCaptions?: {
        [Property in ComponentType]?: string;
    };
};

export const defaultParams: IWalletConfirmCParams = {
    class: 'wlc-wallet-confirm',
    componentName: 'wlc-wallet-confirm',
    moduleName: 'multi-wallet',
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
