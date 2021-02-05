import {
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {FormElements} from './form-elements';

export const depositForm: IFormWrapperCParams = {
    class: 'wlc-form-wrapper wlc-amount-form',
    components: [
        FormElements.amount,
        FormElements.rules,
        FormElements.depositButton,
    ],
};

export const depositFormCrypto: IFormWrapperCParams = {
    class: 'wlc-form-wrapper wlc-amount-form',
    components: [
        FormElements.rules,
        FormElements.depositButton,
    ],
};

export const withdrawForm: IFormWrapperCParams = {
    class: 'wlc-form-wrapper wlc-amount-form',
    components: [
        FormElements.amount,
        FormElements.withdrawButton,
    ],
};
