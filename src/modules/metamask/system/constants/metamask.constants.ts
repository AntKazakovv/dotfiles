import {TMetamaskMsgAction} from 'wlc-engine/modules/metamask/system/interfaces/metamask.interfaces';

export const metamaskCurrencies: ReadonlySet<string> = new Set<string>([
    'ETH',
    'USDT',
]);

export const metamaskMethods = {
    requestAccounts: 'eth_requestAccounts',
    personalSign: 'personal_sign',
} as const;

/**
 * Prefixes for signature request messages.
 */
export const metamaskActionMessages: Record<TMetamaskMsgAction, string> = {
    reg: gettext('I want to register in'),
    login: gettext('I want to sign in'),
    profile: gettext('I want to update profile in'),
} as const;
