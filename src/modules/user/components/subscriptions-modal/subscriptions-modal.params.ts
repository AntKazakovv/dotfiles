
import {UntypedFormControl} from '@angular/forms';

import {
    CustomType,
    ICheckboxCParams,
    IComponentParams,
    IIndexing,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ISubscriptionsModalParams extends IComponentParams<Theme, Type, ThemeMod> {
    title: string,
    btnText: string,
    emailText: string,
    smsText: string,
}

export const buttonsConfig: IIndexing<ICheckboxCParams> = {
    email: {
        name: 'notification-email',
        theme: 'toggle',
        control: new UntypedFormControl(),
    },
    sms: {
        name: 'notification-sms',
        theme: 'toggle',
        control: new UntypedFormControl(),
    },
};

export const defaultParams: ISubscriptionsModalParams = {
    moduleName: 'user',
    componentName: 'wlc-subscriptions-modal',
    class: 'wlc-subscriptions-modal',
    title: gettext('Subscriptions'),
    emailText: gettext('Notifications via e-mail'),
    smsText: gettext('Notifications via SMS'),
    btnText: gettext('Save'),
};

export type SubscriptionsType = {
    emailAgree: boolean;
    smsAgree: boolean;
}
