import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '17.0.0': {
        // 'Error sending postmessage from callback
        level: 'error',
    },
    '17.1.0': {
        // Empty payment markup
        level: 'error',
    },
    '17.0.1': {
        // 'Error endpoint deposit
        level: 'error',
    },
    '17.0.2': {
        // 'Error endpoint withdraw
        level: 'error',
    },
    '17.1.1': {
        // Error loading payment markup script
        level: 'error',
    },
    '17.2.0': {
        // Metamask
        // ethers internal https://docs.ethers.io/v5/api/utils/logger/#errors
        level: 'error',
    },
    '17.2.1': {
        // Metamask internal except -32002
        level: 'error',
    },
    '17.2.2': {
        // not Metamask or Ethers errors
        level: 'error',
    },
    '17.3.0': {
        // Getting cashback plans error
        level: 'error',
    },
    '17.3.1': {
        // Cashback reward claim error
        // Request last successful deposit method error
        level: 'error',
    },
    '17.4.0': {
        // Error getting code for mobile commerce kz
        level: 'error',
    },
    '17.5.0': {
        // Error getting commissions
        level: 'error',
    },
    '17.6.0': {
        // Error getting transactions history
        level: 'error',
    },
    '17.7.0': {
        // Wrong Terms version format
        level: 'error',
    },
    '17.8.0': {
        // Error canceling withdrawal
        level: 'error',
    },
    '17.9.0': {
        // Deposit wager report not found
        level: 'error',
    },
};
