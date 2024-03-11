import {
    CustomType,
    IButtonCParams,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {Theme} from 'wlc-engine/modules/core/components/button/button.params';

export type ComponentType = 'default' | CustomType;
export type WalletsThemeMod = 'finances';

export interface WalletsParams extends IComponentParams<Theme, ComponentType, string> {
    notFoundText?: string;
    depositBtnParams?: IButtonCParams;
    showDepositBtn?: boolean;
    themeMod?: WalletsThemeMod;
    depositIconPath?: string;
    isWithdrawal?: boolean;
    filterText?: string;
    settingsText?: string;
}

export const defaultParams: WalletsParams = {
    class: 'wlc-wallets',
    moduleName: 'multi-wallet',
    componentName: 'wlc-wallets',
    notFoundText: gettext('Sorry, but nothing was found. Check the spelling or try a different name.'),
    showDepositBtn: false,
    isWithdrawal: false,
    theme: 'default',
    filterText: gettext('Filter'),
    settingsText: gettext('Wallet settings'),
};
