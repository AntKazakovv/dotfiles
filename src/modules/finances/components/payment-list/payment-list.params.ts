import {
    IComponentParams,
    CustomType,
    DeviceType,
} from 'wlc-engine/modules/core';
import {ColorIconBgType} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default'  | CustomType;

export type IconsType = 'color' | 'black';
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
    chosenMethodText?: string;
    /** Apply one of two types of colored icons (works only with colored) */
    colorIconBg?: ColorIconBgType;
}

export const defaultParams: IPaymentListCParams = {
    class: 'wlc-payment-list',
    componentName: 'wlc-payment-list',
    moduleName: 'finances',
    paymentType: 'deposit',
    iconsType: 'color',
    colorIconBg: 'dark',
    buttonText: gettext('Show all methods'),
    arrowIcon: 'wlc/icons/arrow.svg',
    asModal: '(max-width: 479px)',
    showTable: undefined,
    modalSize: 'md',
    modalTitle: gettext('Choose payment option'),
    hideModalOnSelect: true,
    showSelectedInButton: true,
    chosenMethodText: gettext('The chosen payment method:'),
};
