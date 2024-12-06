import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IConfirmImprovementModalCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    bonus?: Bonus;
    agreeBtnParams?: IButtonCParams;
    disagreeBtnParams?: IButtonCParams;
    depositBtnParams?: IButtonCParams;
    backBtnParams?: IButtonCParams;
    textBalance?: string;
    textPrice?: string;
    textImprovementAvailable?: string;
    textImprovementUnavailable?: string;
    textConfirmation?: string;
    insufficientBalanceTitle?: string;
    insufficientBalanceMessage?: string;
    purchaseTitle?: string;
    purchaseMessage?: string;
    digitsInfo?: string;
    onConfirm?: (bonus: Bonus) => Promise<void>;
    onReject?: () => Promise<void>;
}

export const defaultParams: IConfirmImprovementModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-confirm-improvement-modal',
    class: 'wlc-confirm-improvement-modal',
    agreeBtnParams: {
        common: {
            text: gettext('Yes'),
            typeAttr: 'button',
        },
        wlcElement: 'button_agree',
    },
    disagreeBtnParams: {
        themeMod: 'secondary',
        common: {
            text: gettext('No'),
            typeAttr: 'button',
        },
        wlcElement: 'button_disagree',
    },
    depositBtnParams: {
        customMod: 'deposit',
        common: {
            text: gettext('Deposit'),
            sref: 'app.profile.cash.deposit',
            typeAttr: 'button',
        },
        wlcElement: 'button_deposit',
    },
    backBtnParams: {
        themeMod: 'secondary',
        common: {
            text: gettext('Back'),
            typeAttr: 'button',
        },
        wlcElement: 'button_back',
    },
    textBalance: gettext('Real balance:'),
    textPrice: gettext('Improvement price:'),
    textImprovementAvailable: gettext('The improvement price will be debited from your real balance'),
    textImprovementUnavailable: gettext('Insufficient balance. Please make a deposit to continue'),
    textConfirmation: gettext('Are you sure?'),
    insufficientBalanceTitle: gettext('Insufficient balance'),
    insufficientBalanceMessage: gettext('Deposit more money to improve this reward'),
    purchaseTitle: gettext('Purchase'),
    purchaseMessage: gettext('Item has been successfully purchased'),
    digitsInfo: '1-0-2',
};
