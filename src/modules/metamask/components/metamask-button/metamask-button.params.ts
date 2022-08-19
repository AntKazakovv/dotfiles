import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IPaymentMessage} from 'wlc-engine/modules/finances';

export type ComponentTheme = 'default' | 'block' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IMetamaskButtonCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Path to metamask icon. By default, icon from gstatic is icon from metamask brand resources
     */
    iconPath?: string;
    /**
     * Prefix before MetaMask
     */
    prefix?: string;
    /**
     * Available for theme `default`
     */
    paymentMessage?: IPaymentMessage;
};

export const defaultParams: IMetamaskButtonCParams = {
    class: 'wlc-metamask-button',
    componentName: 'wlc-metamask-button',
    moduleName: 'metamask',
    iconPath: 'wlc/icons/metamask.svg',
    prefix: gettext('Pay with'),
};
