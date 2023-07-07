import {
    CustomType,
    IButtonCParams,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {Theme} from 'wlc-engine/modules/core/components/button/button.params';

export type ComponentType = 'default' | CustomType;
export type WalletsThemeMod = 'finances';

export interface WalletsParams extends IComponentParams<Theme, ComponentType, string> {
    hideWalletText?: string;
    notFoundText?: string;
    depositBtnParams?: IButtonCParams;
    showDepositBtn?: boolean;
    themeMod?: WalletsThemeMod;
    depositIconPath?: string;
    hideWalletsWithZeroBalance?: boolean;
}

export const defaultParams: WalletsParams = {
    class: 'wlc-wallets',
    moduleName: 'user',
    componentName: 'wlc-wallets',
    hideWalletText: gettext('Hide zero balances'),
    notFoundText: gettext('Sorry, but nothing was found. Check the spelling or try a different name.'),
    showDepositBtn: false,
    hideWalletsWithZeroBalance: false,
    theme: 'default',
};
