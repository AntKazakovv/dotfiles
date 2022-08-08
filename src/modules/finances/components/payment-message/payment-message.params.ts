import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITimerCParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'modal' | CustomType;

export interface IPaymentMessageCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    class: string;
    system?: PaymentSystem;
    minAmount?: number;
    maxAmount?: number;
};

export const defaultParams: IPaymentMessageCParams = {
    class: 'wlc-payment-message',
    componentName: 'wlc-payment-message',
    moduleName: 'finances',
};

export const timerParams: ITimerCParams = {
    theme: 'one-line',
    common: {
        noDays: true,
        noHours: true,
        text: gettext('Time remaining for deposit:'),
    },
    acronyms: {
        minutes: gettext('min'),
        seconds: gettext('sec'),
    },
    dividers: {
        units: ' ',
        text: ' ',
    },
    iconPath: '/wlc/icons/spinner-1.svg',
};
