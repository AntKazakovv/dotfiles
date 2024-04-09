import {IFormComponent, ITimerCParams} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IPaymentMessageCParams} from 'wlc-engine/modules/finances/components/payment-message/payment-message.params';
import {TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models';

export type ComponentTheme = 'default' | CustomType;
/**
 * default - basic payment form
 *
 * partial-amount - additional fields and hosted fields wouldn't be showed (used with steps theme of deposit-withdraw)
 *
 * partial-additional - show only additional and hosted fields (used with steps theme of deposit-withdraw)
 */
export type ComponentType = 'default' | 'partial-amount' | 'partial-additional' | CustomType;
export type ComponentThemeMod = 'default' | 'centered' | CustomType;

export interface IPaymentFormCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    mode: TPaymentsMethods;
    amountWrapperParams?: IFormComponent;
    additionalFieldsWrapperParams?: IFormComponent;
    limitsWrapperParams?: IFormComponent;
    paymentSystem?: PaymentSystem;
    hideClearAmountButton?: boolean;
    /** Enables a field with decrement and increment buttons */
    amountWithButtons?: boolean;
    paymentMessageParams?: Partial<IPaymentMessageCParams>;
    /** Params for timer element */
    timerParams?: ITimerCParams;
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


export const defaultParams: IPaymentFormCParams = {
    class: 'wlc-payment-form',
    componentName: 'wlc-payment-form',
    moduleName: 'finances',
    mode: 'deposit',
    limitsWrapperParams: {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-amount-limit__wrap',
            components: [
                {
                    name: 'core.wlc-amount-limit',
                },
            ],
        },
    },
    amountWrapperParams: {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-amount-wrapper',
            components: [],
        },
    },
    additionalFieldsWrapperParams: {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-additional-fields',
            components: [],
        },
    },
};
