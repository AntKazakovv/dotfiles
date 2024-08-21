import {
    CustomType,
    IButtonCParams,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {Theme} from 'wlc-engine/modules/core/components/button/button.params';

/** Defines different functionality
 * default - for global switching wallet (in header)
 * loyalty - for loyalty operations (buy/subscribe bonuses/store items/tournaments)
 * deposit - for using on Deposit page
 * withdrawal - for using on Withdraw page
 */
export type ComponentType = 'default' | 'loyalty' | 'deposit' | 'withdrawal' | CustomType;
export type WalletsThemeMod = 'finances';

export interface WalletsParams extends IComponentParams<Theme, ComponentType, string> {
    notFoundText?: string;
    depositBtnParams?: IButtonCParams;
    showDepositBtn?: boolean;
    themeMod?: WalletsThemeMod;
    depositIconPath?: string;
    isWithdrawal?: boolean;
    filterText?: string;
    filterIcon?: string;
    settingsText?: string;
    onWalletChange?: Function;
}

export const defaultParams: WalletsParams = {
    class: 'wlc-wallets',
    moduleName: 'multi-wallet',
    componentName: 'wlc-wallets',
    notFoundText: gettext('Sorry, but nothing was found. Check the spelling or try a different name.'),
    showDepositBtn: true,
    isWithdrawal: false,
    theme: 'default',
    filterText: gettext('Filter'),
    filterIcon: '/wlc/icons/filter.svg',
    settingsText: gettext('Wallet settings'),
    depositBtnParams: {
        common: {
            sref: 'app.profile.cash.deposit',
            text: gettext('Deposit'),
        },
    },
};
