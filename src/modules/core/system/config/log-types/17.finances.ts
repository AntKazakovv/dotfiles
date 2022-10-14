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
    '17.1.1': {
        // Error loading payment markup script
        level: 'error',
    },
    // Metamask
    '17.2.0': {
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
};
