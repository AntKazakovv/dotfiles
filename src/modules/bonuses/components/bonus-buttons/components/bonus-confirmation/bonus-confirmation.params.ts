import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export type IConfirmationAction = 'cancel' | 'subscribe';

export interface IBonusConfirmationParams extends IComponentParams<Theme, Type, ThemeMod> {
    textBonusBalanceDecrease?: string,
    textRealBalanceDecrease?: string,
    textSubscribeWarning?: string,
    text?: string,
    iconPath?: string,
    showCurrencyString?: boolean
}

export const defaultParams: IBonusConfirmationParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-confirmation',
    class: 'wlc-bonus-confirmation',
    text: gettext('Are you sure?'),
    textBonusBalanceDecrease: gettext('Your bonus balance will be debited on: '),
    textRealBalanceDecrease: gettext('Your real balance will be debited on: '),
    textSubscribeWarning: gettext('The current active bonus prohibits the activation of other bonuses. '
                                + 'Activation of this bonus will not happen. Are you sure you want to subscribe?'),
    iconPath: '/wlc/icons/status/confirm.svg',
    showCurrencyString: false,
};
