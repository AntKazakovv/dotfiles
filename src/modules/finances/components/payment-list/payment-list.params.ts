import {
    CustomType,
    DeviceType,
} from 'wlc-engine/modules/core';
import {IAbstractIconsListParams} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';
import {TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export type IconsType = 'color' | 'black';
/**
 * @variation `mobile` - show button mode only on mobile
 * @variation `tablet` - show button mode only on tablet
 * @variation `desktop` - show button mode only on desktop
 * @variation `breakpoint` - show button mode according to breakpoint
 */
export type ShowType = string | DeviceType;

export interface INoSelectedButton {
    use?: boolean;
    icon?: string;
    title?: string;
    subtitle?: string;
}

export interface IPaymentListCParams extends IAbstractIconsListParams<Theme, Type, ThemeMod> {
    paymentType?: TPaymentsMethods;
    /**
     * Available values 'null' or 'mediaQueryString'. Default is `'(max-width: 479px)'`
     * We can pass in this param media queries (max-width for example), and payments list will be shown in
     * modal by click on button "choose method"
     * as well we can pass null in this param, and list will be shown as tiles
     *
     * if we want to set custom settings we have to write them in 04.modules.config.ts
     * finances: {
     *   components: {
     *      'wlc-payment-list': {
     *          asModal: null,
     *      },
     *   },
     * },
     */
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
    noSelectedButton?: INoSelectedButton;
}

export const defaultParams: IPaymentListCParams = {
    class: 'wlc-payment-list',
    componentName: 'wlc-payment-list',
    moduleName: 'finances',
    paymentType: 'deposit',
    iconsType: 'color',
    colorIconBg: 'dark',
    buttonText: gettext('Show all methods'),
    arrowIcon: 'wlc/icons/arrow-left.svg',
    asModal: '(max-width: 479px)',
    showTable: undefined,
    modalSize: 'md',
    modalTitle: gettext('Choose payment option'),
    hideModalOnSelect: true,
    showSelectedInButton: true,
    chosenMethodText: gettext('The chosen payment method:'),
    noSelectedButton: {
        use: true,
        icon: 'wlc/icons/empty-paysystem.svg',
        title: gettext('Choose payment method.'),
        subtitle: gettext('Show all methods'),
    },
};
