import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {DeviceType} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default'  | CustomType;

export type IconsType = 'default' | 'svg';
/**
 * @variation `mobile` - show button mode only on mobile
 * @variation `tablet` - show button mode only on tablet
 * @variation `desktop` - show button mode only on desktop
 * @variation `breakpoint` - show button mode according to breakpoint
 */
export type ShowType = string | DeviceType;

export interface IPaymentListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    paymentType?: 'deposit' | 'withdraw';
    asModal?: ShowType;
    showTable?: ShowType;
    iconsType?: IconsType;
    buttonText?: string;
    showSelectedInButton?: boolean;
    arrowIcon?: string;
    modalSize?: string;
    modalTitle?: string;
    hideModalOnSelect?: boolean;
}

export const defaultParams: IPaymentListCParams = {
    paymentType: 'deposit',
    class: 'wlc-payment-list',
    iconsType: 'default',
    buttonText: 'Show all methods',
    arrowIcon: 'arrow',
    asModal: '(max-width: 479px)',
    showTable: '(max-width: 479px)',
    modalSize: 'md',
    modalTitle: 'Choose payment option',
    hideModalOnSelect: true,
    showSelectedInButton: true,
};
